from pathlib import Path

from django.core.management.base import BaseCommand
from django.core.files import File

from products.models import Product, ProductImage, Category


class Command(BaseCommand):
    help = "Fix NØVA text and connect product images"

    products = [
        "essential-oversized-tee",
        "heavyweight-tee",
        "relaxed-cargo-pants",
        "wide-leg-trouser",
        "classic-bomber",
        "urban-tech-jacket",
        "oversized-denim-jacket",
        "utility-cargo-shorts",
        "essential-hoodie",
        "heavyweight-sweatshirt",
        "womens-oversized-tee",
        "womens-graphic-tee",
        "womens-wide-leg-pants",
        "womens-relaxed-jogger",
        "womens-cropped-bomber",
        "womens-puffer-jacket",
        "womens-denim-jacket",
        "womens-essential-hoodie",
        "womens-zip-hoodie",
        "womens-denim-shorts",
    ]

    def handle(self, *args, **kwargs):

        # =====================================================
        # FIX CORRUPTED NØVA TEXT
        # =====================================================

        # The corrupted value currently appearing in production
        bad = "N\u2260VA"

        # Correct NØVA
        good = "N\u00d8VA"

        fixed_products = 0
        fixed_categories = 0

        # Products
        for product in Product.objects.all():

            changed = False

            if product.name and bad in product.name:
                product.name = product.name.replace(
                    bad,
                    good,
                )
                changed = True

            if product.brand and bad in product.brand:
                product.brand = product.brand.replace(
                    bad,
                    good,
                )
                changed = True

            if product.description and bad in product.description:
                product.description = product.description.replace(
                    bad,
                    good,
                )
                changed = True

            if changed:
                product.save()
                fixed_products += 1

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Fixed product: {product.id}"
                    )
                )

        # Categories
        for category in Category.objects.all():

            changed = False

            if category.name and bad in category.name:
                category.name = category.name.replace(
                    bad,
                    good,
                )
                changed = True

            if category.description and bad in category.description:
                category.description = category.description.replace(
                    bad,
                    good,
                )
                changed = True

            if changed:
                category.save()
                fixed_categories += 1

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Fixed category: {category.id}"
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"NØVA text fixed. "
                f"Products: {fixed_products}, "
                f"Categories: {fixed_categories}"
            )
        )

        # =====================================================
        # CONNECT PRODUCT IMAGES
        # =====================================================

        media_path = Path("media/products")

        for number, slug in enumerate(
            self.products,
            start=1,
        ):

            try:
                product = Product.objects.get(
                    slug=slug
                )

            except Product.DoesNotExist:

                self.stdout.write(
                    self.style.ERROR(
                        f"Product not found: {slug}"
                    )
                )

                continue

            for image_number in [1, 2]:

                filename = (
                    f"{number:02d}-"
                    f"{slug}-"
                    f"{image_number}.png"
                )

                image_path = (
                    media_path / filename
                )

                if not image_path.exists():

                    self.stdout.write(
                        self.style.WARNING(
                            f"Image missing: {filename}"
                        )
                    )

                    continue

                # Prevent duplicate ProductImage records
                if ProductImage.objects.filter(
                    product=product,
                    image__icontains=(
                        f"{slug}-{image_number}"
                    )
                ).exists():

                    self.stdout.write(
                        f"Already connected: {filename}"
                    )

                    continue

                with open(
                    image_path,
                    "rb",
                ) as image_file:

                    ProductImage.objects.create(
                        product=product,
                        image=File(
                            image_file,
                            name=(
                                f"{slug}-"
                                f"{image_number}.png"
                            ),
                        ),
                        is_primary=(
                            image_number == 1
                        ),
                    )

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Connected: "
                        f"{product.name} ← "
                        f"{filename}"
                    )
                )

        self.stdout.write("")

        self.stdout.write(
            self.style.SUCCESS(
                "Finished connecting new NØVA images!"
            )
        )