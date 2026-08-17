from django.core.management.base import BaseCommand
from products.models import Product, ProductVariant


class Command(BaseCommand):
    help = "Create product variants for NØVA products"

    def handle(self, *args, **kwargs):

        variants = {
            "backpack": [
                ("Black", "", 20),
                ("Grey", "", 15),
            ],

            "beanie": [
                ("Black", "One Size", 20),
                ("Grey", "One Size", 15),
            ],

            "belt": [
                ("Black", "S", 10),
                ("Black", "M", 10),
                ("Black", "L", 10),
            ],

            "cap": [
                ("Black", "One Size", 20),
                ("White", "One Size", 15),
            ],

            "cargo": [
                ("Black", "S", 10),
                ("Black", "M", 15),
                ("Black", "L", 10),
                ("Olive", "M", 10),
            ],

            "crossbody": [
                ("Black", "One Size", 20),
                ("Brown", "One Size", 10),
            ],

            "denim": [
                ("Blue", "30", 10),
                ("Blue", "32", 15),
                ("Blue", "34", 10),
                ("Blue", "36", 5),
            ],

            "duffle": [
                ("Black", "One Size", 15),
                ("Grey", "One Size", 10),
            ],

            "hoodie": [
                ("Black", "S", 10),
                ("Black", "M", 15),
                ("Black", "L", 10),
                ("Grey", "M", 10),
            ],

            "jacket-bomber": [
                ("Black", "S", 8),
                ("Black", "M", 12),
                ("Black", "L", 10),
                ("Black", "XL", 5),
            ],

            "jacket-denim": [
                ("Blue", "S", 8),
                ("Blue", "M", 12),
                ("Blue", "L", 10),
                ("Blue", "XL", 5),
            ],

            "jacket-tech": [
                ("Black", "S", 8),
                ("Black", "M", 12),
                ("Black", "L", 10),
                ("Black", "XL", 5),
            ],

            "jogger": [
                ("Black", "S", 10),
                ("Black", "M", 15),
                ("Black", "L", 10),
                ("Grey", "M", 10),
            ],

            "overcoat": [
                ("Black", "M", 8),
                ("Black", "L", 10),
                ("Black", "XL", 5),
            ],

            "puffer": [
                ("Black", "S", 8),
                ("Black", "M", 12),
                ("Black", "L", 10),
                ("Black", "XL", 5),
            ],

            "shorts-cargo": [
                ("Black", "S", 10),
                ("Black", "M", 15),
                ("Olive", "L", 10),
            ],

            "shorts-denim": [
                ("Blue", "30", 10),
                ("Blue", "32", 15),
                ("Blue", "34", 10),
            ],

            "sneaker": [
                ("Black", "7", 5),
                ("Black", "8", 10),
                ("Black", "9", 10),
                ("Black", "10", 5),
            ],

            "sneaker-low": [
                ("White", "7", 5),
                ("White", "8", 10),
                ("White", "9", 10),
                ("White", "10", 5),
            ],

            "sneaker-trail": [
                ("Black", "7", 5),
                ("Black", "8", 10),
                ("Black", "9", 10),
                ("Black", "10", 5),
            ],

            "sunglasses": [
                ("Black", "One Size", 20),
                ("Brown", "One Size", 10),
            ],

            "sweatshirt": [
                ("Black", "S", 10),
                ("Black", "M", 15),
                ("Black", "L", 10),
            ],

            "tee-graphic": [
                ("Black", "S", 10),
                ("Black", "M", 15),
                ("Black", "L", 10),
                ("White", "M", 10),
            ],

            "tee-heavy": [
                ("Black", "S", 10),
                ("Black", "M", 15),
                ("Black", "L", 10),
            ],

            "tee-oversized": [
                ("Black", "S", 10),
                ("Black", "M", 15),
                ("Black", "L", 10),
                ("White", "M", 10),
            ],

            "trouser": [
                ("Black", "30", 10),
                ("Black", "32", 15),
                ("Black", "34", 10),
                ("Black", "36", 5),
            ],

            "vest": [
                ("Black", "S", 8),
                ("Black", "M", 12),
                ("Black", "L", 10),
            ],
        }

        ProductVariant.objects.all().delete()

        created_count = 0

        for slug, product_variants in variants.items():

            try:
                product = Product.objects.get(slug=slug)
            except Product.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(
                        f"Product not found: {slug}"
                    )
                )
                continue

            for color, size, stock in product_variants:

                ProductVariant.objects.create(
                    product=product,
                    color=color,
                    size=size,
                    stock=stock
                )

                created_count += 1

            self.stdout.write(
                self.style.SUCCESS(
                    f"Variants created: {product.name}"
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nSuccessfully created {created_count} variants!"
            )
        )