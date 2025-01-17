from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class ApplicationStatus(models.TextChoices):
    DRAFT = "draft", _("Draft")
    RECEIVED = "received", _("Received")
    HANDLING = "handling", _("Handling")
    ADDITIONAL_INFORMATION_NEEDED = "additional_information_needed", _(
        "Additional information requested"
    )
    CANCELLED = "cancelled", _("Cancelled")
    ACCEPTED = "accepted", _("Accepted")
    REJECTED = "rejected", _("Rejected")

    @classmethod
    def is_editable_status(cls, user, status):
        if settings.NEXT_PUBLIC_MOCK_FLAG:
            return cls.is_handler_editable_status(
                status, None
            ) or cls.is_applicant_editable_status(status)
        elif not user.is_authenticated:
            return False
        elif user.is_handler():
            return cls.is_handler_editable_status(status, None)
        else:
            return cls.is_applicant_editable_status(status)

    @classmethod
    def is_handler_editable_status(cls, status, new_status=None):
        if status not in cls.values:
            raise ValueError(_("Invalid application status"))
        if new_status is not None and new_status not in cls.values:
            raise ValueError(_("Invalid application status change"))

        # Application can be transitioned back from these non-editable statuses, so make an exception
        # to make the application editable if status transition is done at the same time
        if (status, new_status) in [
            (ApplicationStatus.ACCEPTED, ApplicationStatus.HANDLING),
            (ApplicationStatus.REJECTED, ApplicationStatus.HANDLING),
        ]:
            return True

        # drafts may be edited by the handler when entering data from a paper application
        return status in (
            cls.DRAFT,
            cls.RECEIVED,
            cls.HANDLING,
            cls.ADDITIONAL_INFORMATION_NEEDED,
        )

    @classmethod
    def is_applicant_editable_status(cls, status):
        if status not in cls.values:
            raise ValueError(_("Invalid application status"))
        return status in (cls.DRAFT, cls.ADDITIONAL_INFORMATION_NEEDED)


class BenefitType(models.TextChoices):
    EMPLOYMENT_BENEFIT = "employment_benefit", _("Employment Benefit")
    SALARY_BENEFIT = "salary_benefit", _("Salary Benefit")
    COMMISSION_BENEFIT = "commission_benefit", _("Commission Benefit")


class ApplicationStep(models.TextChoices):
    STEP_1 = "step_1", _("Step 1 - company details")
    STEP_2 = "step_2", _("Step 2 - employee details")
    STEP_3 = "step_3", _("Step 3 - attachments")
    STEP_4 = "step_4", _("Step 4 - summary")
    STEP_5 = "step_5", _("Step 5 - power of attorney")
    STEP_6 = "step_6", _("Step 6 - terms and send")


class OrganizationType(models.TextChoices):
    """
    Coarse classification of the applicant organization type
    """

    COMPANY = "company", _("Company")
    ASSOCIATION = "association", _("Association")

    @classmethod
    def resolve_organization_type(cls, company_form_code):
        # company is the default organization type
        if company_form_code in settings.ASSOCIATION_FORM_CODES:
            return OrganizationType.ASSOCIATION
        else:
            return OrganizationType.COMPANY


class AttachmentType(models.TextChoices):
    EMPLOYMENT_CONTRACT = "employment_contract", _("employment contract")
    PAY_SUBSIDY_DECISION = "pay_subsidy_decision", _("pay subsidy decision")
    COMMISSION_CONTRACT = "commission_contract", _("commission contract")
    EDUCATION_CONTRACT = "education_contract", _(
        "education contract of the apprenticeship office"
    )
    HELSINKI_BENEFIT_VOUCHER = "helsinki_benefit_voucher", _("helsinki benefit voucher")
    EMPLOYEE_CONSENT = "employee_consent", _("helsinki benefit voucher")


class AttachmentRequirement(models.TextChoices):
    REQUIRED = "required", _("attachment is required")
    OPTIONAL = "optional", _("attachment is optional")


class ApplicationBatchStatus(models.TextChoices):
    DRAFT = "draft", _("Draft")
    AHJO_REPORT_CREATED = "exported_ahjo_report", _(
        "Ahjo report created, not yet sent to AHJO"
    )
    AWAITING_AHJO_DECISION = "awaiting_ahjo_decision", _(
        "Sent to Ahjo, decision pending"
    )
    DECIDED_ACCEPTED = "accepted", _("Accepted in Ahjo")
    DECIDED_REJECTED = "rejected", _("Rejected in Ahjo")
    RETURNED = "returned", _(
        "Returned from Ahjo without decision"
    )  # Theoretically possible: means that a decision was not made
    SENT_TO_TALPA = "sent_to_talpa", _("Sent to Talpa")
    COMPLETED = "completed", _("Processing is completed")


class AhjoDecision(models.TextChoices):
    # The possible decisions for Ahjo processing
    DECIDED_ACCEPTED = ApplicationBatchStatus.DECIDED_ACCEPTED
    DECIDED_REJECTED = ApplicationBatchStatus.DECIDED_REJECTED
