from django.core.management.base import BaseCommand
from products.models import Product, ProductImage


class Command(BaseCommand):
    help = "Reset NØVA seeded products and images"

    def handle(self, *args, **kwargs):

        ProductImage.objects.all().delete()
        Product.objects.all().delete()

        self.stdout.write(
            self.style.SUCCESS(
                "Products and product images cleared successfully."
            )
        )