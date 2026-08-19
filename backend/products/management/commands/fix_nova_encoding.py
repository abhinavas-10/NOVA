from django.core.management.base import BaseCommand
from products.models import Product, Category


class Command(BaseCommand):
    help = "Fix corrupted NØVA text encoding"

    def handle(self, *args, **options):
        bad = "N\u00f1VA"
        good = "N\u00d8VA"

        product_count = 0
        category_count = 0

        # ---------------------------------------------
        # PRODUCTS
        # ---------------------------------------------

        for product in Product.objects.all():
            changed = False

            if product.name and bad in product.name:
                product.name = product.name.replace(bad, good)
                changed = True

            if product.brand and bad in product.brand:
                product.brand = product.brand.replace(bad, good)
                changed = True

            if product.description and bad in product.description:
                product.description = product.description.replace(
                    bad, good
                )
                changed = True

            if changed:
                product.save()
                product_count += 1

                self.stdout.write(
                    f"Fixed product: {product.id}"
                )

        # ---------------------------------------------
        # CATEGORIES
        # ---------------------------------------------

        for category in Category.objects.all():
            changed = False

            if category.name and bad in category.name:
                category.name = category.name.replace(
                    bad, good
                )
                changed = True

            if category.description and bad in category.description:
                category.description = category.description.replace(
                    bad, good
                )
                changed = True

            if changed:
                category.save()
                category_count += 1

                self.stdout.write(
                    f"Fixed category: {category.id}"
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Finished. Products fixed: {product_count}, "
                f"Categories fixed: {category_count}"
            )
        )