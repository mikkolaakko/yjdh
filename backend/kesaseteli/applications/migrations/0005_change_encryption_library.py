# Generated by Django 3.2.4 on 2021-08-18 07:35

from django.db import migrations, models
import encrypted_fields.fields


class Migration(migrations.Migration):

    dependencies = [
        ("applications", "0004_application_default_status"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="historicalsummervoucher",
            name="employee_ssn",
        ),
        migrations.RemoveField(
            model_name="summervoucher",
            name="employee_ssn",
        ),
        migrations.AddField(
            model_name="historicalsummervoucher",
            name="employee_ssn",
            field=encrypted_fields.fields.EncryptedCharField(
                blank=True,
                max_length=32,
                verbose_name="employee social security number",
            ),
        ),
        migrations.AddField(
            model_name="summervoucher",
            name="employee_ssn",
            field=encrypted_fields.fields.EncryptedCharField(
                blank=True,
                max_length=32,
                verbose_name="employee social security number",
            ),
        ),
    ]
