
from rest_framework import serializers
from .models import Table, Reservation


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        feilds = [
            'id','capacity','reserved'
        ]


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        table = TableSerializer(many=True)
        feilds = [
            'table',
            'user',
            'reservation_date',
            'made_on'
        ]
