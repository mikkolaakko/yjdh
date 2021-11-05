import copy
import decimal
from unittest import mock

from applications.api.v1.serializers import HandlerApplicationSerializer
from applications.enums import ApplicationStatus, BenefitType, OrganizationType
from applications.tests.conftest import *  # noqa
from applications.tests.test_applications_api import (
    add_attachments_to_application,
    get_detail_url,
    get_handler_detail_url,
)
from calculator.api.v1.serializers import CalculationSerializer
from calculator.tests.factories import CalculationFactory, PaySubsidyFactory


def test_application_retrieve_calculation_as_handler(handler_api_client, application):
    response = handler_api_client.get(get_handler_detail_url(application))
    assert "calculation" in response.data
    assert "pay_subsidies" in response.data
    assert response.status_code == 200


def test_application_try_retrieve_calculation_as_applicant(api_client, application):
    response = api_client.get(get_detail_url(application))
    assert "calculation" not in response.data
    assert "pay_subsidies" not in response.data
    assert response.status_code == 200


def test_application_create_calculation_on_submit(
    request, handler_api_client, application
):
    application.status = ApplicationStatus.DRAFT
    application.pay_subsidy_percent = 50
    application.pay_subsidy_granted = True
    application.benefit_type = BenefitType.SALARY_BENEFIT
    application.save()
    assert not hasattr(application, "calculation")
    data = HandlerApplicationSerializer(application).data

    data["status"] = ApplicationStatus.RECEIVED
    data["bases"] = []  # as of 2021-10, bases are not used when submitting application
    add_attachments_to_application(request, application)
    if data["company"]["organization_type"] == OrganizationType.ASSOCIATION:
        data["association_has_business_activities"] = False
        data["association_immediate_manager_check"] = True

    with mock.patch(
        "terms.models.ApplicantTermsApproval.terms_approval_needed", return_value=False
    ):
        response = handler_api_client.put(
            get_handler_detail_url(application),
            data,
        )

    assert response.status_code == 200
    application.refresh_from_db()
    assert hasattr(application, "calculation")

    assert response.data["calculation"] is not None
    assert response.data["calculation"]["monthly_pay"] == str(
        application.employee.monthly_pay
    )
    assert response.data["calculation"]["start_date"] == str(application.start_date)
    assert len(response.data["calculation"]["rows"]) > 1
    assert response.status_code == 200


def test_application_can_not_create_calculation_through_api(
    handler_api_client, application
):
    """ """
    assert not hasattr(application, "calculation")
    data = HandlerApplicationSerializer(application).data
    calc_data = CalculationSerializer(CalculationFactory()).data
    data["calculation"] = calc_data
    response = handler_api_client.put(
        get_handler_detail_url(application),
        data,
    )
    assert response.status_code == 200
    assert response.data["calculation"] is None
    application.refresh_from_db()
    assert not hasattr(application, "calculation")


def test_modify_calculation(handler_api_client, received_application):
    """
    modify existing calculation
    """
    data = HandlerApplicationSerializer(received_application).data
    assert received_application.calculation
    assert received_application.pay_subsidies.count() == 0
    data["calculation"]["monthly_pay"] = "1234.56"
    # also modify pay_subsidies. Although multiple objects are modified, calculate() should only
    # be called once.
    data["pay_subsidies"] = [
        {
            "start_date": str(received_application.start_date),
            "end_date": str(received_application.end_date),
            "pay_subsidy_percent": 50,
            "work_time_percent": 100,
        }
    ]
    with mock.patch("calculator.models.Calculation.calculate") as calculate_wrap:
        response = handler_api_client.put(
            get_handler_detail_url(received_application),
            data,
        )
        calculate_wrap.assert_called_once()

    assert response.status_code == 200
    assert response.data["calculation"]["monthly_pay"] == "1234.56"
    received_application.refresh_from_db()
    assert received_application.calculation.monthly_pay == decimal.Decimal("1234.56")
    assert received_application.pay_subsidies.count() == 1
    assert received_application.pay_subsidies.first().pay_subsidy_percent == 50
    assert (
        received_application.pay_subsidies.first().start_date
        == received_application.start_date
    )
    assert (
        received_application.pay_subsidies.first().end_date
        == received_application.end_date
    )


def test_can_not_delete_calculation(handler_api_client, received_application):
    """
    application.calculation can not be deleted through the API - setting application to None is ignored
    """
    data = HandlerApplicationSerializer(received_application).data
    data["calculation"] = None
    handler_api_client.put(
        get_handler_detail_url(received_application),
        data,
    )
    received_application.refresh_from_db()
    assert received_application.calculation


def test_application_replace_pay_subsidy(handler_api_client, received_application):
    data = HandlerApplicationSerializer(received_application).data

    data["pay_subsidies"] = [
        {
            "start_date": str(received_application.start_date),
            "end_date": str(received_application.end_date),
            "pay_subsidy_percent": 50,
            "work_time_percent": 100,
            "disability_or_illness": True,
        }
    ]
    response = handler_api_client.put(
        get_handler_detail_url(received_application),
        data,
    )
    assert response.status_code == 200
    received_application.refresh_from_db()
    new_data = HandlerApplicationSerializer(received_application).data
    del new_data["pay_subsidies"][0]["id"]
    assert new_data["pay_subsidies"] == data["pay_subsidies"]


def test_application_edit_pay_subsidy(handler_api_client, received_application):
    PaySubsidyFactory(application=received_application)
    PaySubsidyFactory(application=received_application)
    data = HandlerApplicationSerializer(received_application).data

    # edit fields
    data["pay_subsidies"][0]["start_date"] = "2021-06-01"
    data["pay_subsidies"][0]["pay_subsidy_percent"] = 40
    # swap order
    data["pay_subsidies"][0], data["pay_subsidies"][1] = (
        data["pay_subsidies"][1],
        data["pay_subsidies"][0],
    )
    response = handler_api_client.put(
        get_handler_detail_url(received_application),
        data,
    )
    assert response.status_code == 200
    assert len(response.data["pay_subsidies"]) == 2
    assert response.data["pay_subsidies"][1]["start_date"] == "2021-06-01"
    assert response.data["pay_subsidies"][1]["pay_subsidy_percent"] == 40


def test_application_delete_pay_subsidy(handler_api_client, received_application):
    data = HandlerApplicationSerializer(received_application).data

    data["pay_subsidies"] = []

    response = handler_api_client.put(
        get_handler_detail_url(received_application),
        data,
    )
    assert response.status_code == 200
    assert response.data["pay_subsidies"] == []


def test_application_edit_pay_subsidy_invalid_values(
    handler_api_client, received_application
):
    data = HandlerApplicationSerializer(received_application).data

    previous_data = copy.deepcopy(data["pay_subsidies"])

    data["pay_subsidies"] = [
        {
            "start_date": str(received_application.start_date),
            "end_date": str(received_application.end_date),
            "pay_subsidy_percent": 150,
            "work_time_percent": -10,
        }
    ]

    response = handler_api_client.put(
        get_handler_detail_url(received_application),
        data,
    )
    assert response.status_code == 400

    received_application.refresh_from_db()
    data_after = HandlerApplicationSerializer(received_application).data
    assert previous_data == data_after["pay_subsidies"]