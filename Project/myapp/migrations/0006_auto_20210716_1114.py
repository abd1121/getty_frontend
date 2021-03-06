# Generated by Django 3.2.4 on 2021-07-16 06:14

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0005_auto_20210716_1106'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='qr_style',
            field=models.CharField(blank=True, max_length=40, null=True),
        ),
        migrations.AlterField(
            model_name='social_profile',
            name='current_datetime',
            field=models.DateTimeField(default=datetime.datetime(2021, 7, 16, 11, 14, 33, 379061)),
        ),
        migrations.AlterField(
            model_name='social_profile',
            name='qr_color',
            field=models.CharField(blank=True, default='#000000', max_length=50, null=True),
        ),
    ]
