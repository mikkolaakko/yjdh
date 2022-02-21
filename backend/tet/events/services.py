import logging
from datetime import date

from events.linkedevents import LinkedEventsClient
from events.transformations import (
    enrich_create_event,
    enrich_update_event,
    reduce_get_event,
)

LOGGER = logging.getLogger(__name__)


class ServiceClient:
    def __init__(self):
        self.client = LinkedEventsClient()

    # All users are city employees (AD login) in MVP phase
    def _is_city_employee(self, user):
        return True

    # TODO return 403 instead of warning
    def _get_event_and_raise_for_unauthorized(self, user, event_id):
        event = self.client.get_event(event_id)
        if self._is_city_employee(user):
            if event["custom_data"] is None:
                LOGGER.warning(
                    f"Any city employee could update event {event['id']} because it has no custom_data"
                )
            else:
                if "editor_email" in event["custom_data"]:
                    if event["custom_data"]["editor_email"] != user.email:
                        # TODO raise
                        LOGGER.warning(
                            f"User {user.email} unauthorized access to event {event['id']}"
                        )
                else:
                    LOGGER.warning(
                        f"Any city employee could update event {event['id']}, editor_email is not set in custom_data"
                    )

        else:
            LOGGER.warning(
                "Authorization not implemented for company users (suomi.fi login)"
            )

        return event

    def _get_publisher(self, user):
        # In MVP phase just returning ahjo:00001 (Helsingin kaupunki) for all
        # We can also get industry (toimiala) from ADFS Graph API (needs translation to ahjo scheme)
        # For company users it is still undecided how we store the company business id (Y-tunnus) in an event
        return "ahjo:00001"

    def list_job_postings_for_user(self, user):
        events = self.client.list_ongoing_events_authenticated()
        job_postings = [reduce_get_event(e) for e in events]
        # TODO divide into published and drafts
        return {
            "draft": job_postings,
            "published": [],
        }

    # not MVP?
    def list_ended_job_postings_for_user(self, user):
        return []

    def get_tet_event(self, event_id, user):
        event = self._get_event_and_raise_for_unauthorized(user, event_id)

        event["location"] = self.client.get_url(event["location"]["@id"])
        event["keywords"] = [self.client.get_url(k["@id"]) for k in event["keywords"]]

        return reduce_get_event(event)

    def add_tet_event(self, validated_data, user):
        event = enrich_create_event(
            validated_data, self._get_publisher(user), user.email
        )
        created_event = self.client.create_event(event)
        return reduce_get_event(created_event)

    def publish_job_posting(self, event_id, user):
        event = self._get_event_and_raise_for_unauthorized(user, event_id)
        # TODO do we also need to set event status?
        event["date_published"] = date.today().isoformat()
        updated_event = self.client.update_event(event_id, event)

        return reduce_get_event(updated_event)

    def update_tet_event(self, event_id, validated_data, user):
        self._get_event_and_raise_for_unauthorized(user, event_id)
        event = enrich_update_event(validated_data, user.email)
        updated_event = self.client.update_event(event_id, event)

        return reduce_get_event(updated_event)

    def delete_event(self, event_id, user):
        self._get_event_and_raise_for_unauthorized(user, event_id)
        return self.client.delete_event(event_id)

    def search_job_postings(self, q):
        pass