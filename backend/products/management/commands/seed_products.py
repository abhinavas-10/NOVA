from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand

from products.models import Category, Product, ProductImage, ProductVariant


class Command(BaseCommand):
    help = "Create/update NØVA products, genders, variants and images"

    # ============================================================
    # PRODUCTS
    # name, slug, category, gender, price, original_price, stock
    # ============================================================

    products = [

        # ========================================================
        # MEN
        # ========================================================

        (
            "Essential Oversized Tee",
            "essential-oversized-tee",
            "T-Shirts",
            "men",
            1999,
            2499,
            50,
        ),

        (
            "Heavyweight Tee",
            "heavyweight-tee",
            "T-Shirts",
            "men",
            2299,
            2999,
            45,
        ),

        (
            "Relaxed Cargo Pants",
            "relaxed-cargo-pants",
            "Pants",
            "men",
            4499,
            5499,
            40,
        ),

        (
            "Wide Leg Trouser",
            "wide-leg-trouser",
            "Pants",
            "men",
            4299,
            4999,
            35,
        ),

        (
            "Classic Bomber",
            "classic-bomber",
            "Jackets",
            "men",
            6499,
            7999,
            25,
        ),

        (
            "Urban Tech Jacket",
            "urban-tech-jacket",
            "Jackets",
            "men",
            7499,
            8999,
            20,
        ),

        (
            "Oversized Denim Jacket",
            "oversized-denim-jacket",
            "Jackets",
            "men",
            5999,
            6999,
            30,
        ),

        (
            "Utility Cargo Shorts",
            "utility-cargo-shorts",
            "Shorts",
            "men",
            2999,
            3699,
            40,
        ),

        (
            "Essential Hoodie",
            "essential-hoodie",
            "Hoodies",
            "men",
            3999,
            4999,
            45,
        ),

        (
            "Heavyweight Sweatshirt",
            "heavyweight-sweatshirt",
            "Hoodies",
            "men",
            3499,
            4299,
            35,
        ),


        # ========================================================
        # WOMEN
        # ========================================================

        (
            "Women's Oversized Tee",
            "womens-oversized-tee",
            "T-Shirts",
            "women",
            1999,
            2499,
            50,
        ),

        (
            "Women's Graphic Tee",
            "womens-graphic-tee",
            "T-Shirts",
            "women",
            2199,
            2799,
            45,
        ),

        (
            "Women's Wide Leg Pants",
            "womens-wide-leg-pants",
            "Pants",
            "women",
            3999,
            4999,
            40,
        ),

        (
            "Women's Relaxed Jogger",
            "womens-relaxed-jogger",
            "Pants",
            "women",
            3299,
            3999,
            35,
        ),

        (
            "Women's Cropped Bomber",
            "womens-cropped-bomber",
            "Jackets",
            "women",
            5999,
            6999,
            30,
        ),

        (
            "Women's Puffer Jacket",
            "womens-puffer-jacket",
            "Jackets",
            "women",
            6999,
            8499,
            25,
        ),

        (
            "Women's Denim Jacket",
            "womens-denim-jacket",
            "Jackets",
            "women",
            5499,
            6499,
            30,
        ),

        (
            "Women's Essential Hoodie",
            "womens-essential-hoodie",
            "Hoodies",
            "women",
            3799,
            4499,
            45,
        ),

        (
            "Women's Zip Hoodie",
            "womens-zip-hoodie",
            "Hoodies",
            "women",
            3999,
            4999,
            40,
        ),

        (
            "Women's Denim Shorts",
            "womens-denim-shorts",
            "Shorts",
            "women",
            2799,
            3499,
            35,
        ),


        # ========================================================
        # UNISEX
        # ========================================================

        (
            "Minimal Hoodie",
            "minimal-hoodie",
            "Hoodies",
            "unisex",
            3999,
            4999,
            60,
        ),

        (
            "Boxy Sweatshirt",
            "boxy-sweatshirt",
            "Hoodies",
            "unisex",
            3499,
            4299,
            55,
        ),

        (
            "Archive Graphic Tee",
            "archive-graphic-tee",
            "T-Shirts",
            "unisex",
            2499,
            2999,
            60,
        ),

        (
            "Studio Heavy Tee",
            "studio-heavy-tee",
            "T-Shirts",
            "unisex",
            2299,
            2799,
            50,
        ),

        (
            "Relaxed Denim",
            "relaxed-denim",
            "Pants",
            "unisex",
            4299,
            4999,
            45,
        ),

        (
            "Utility Jogger",
            "utility-jogger",
            "Pants",
            "unisex",
            3499,
            4299,
            50,
        ),

        (
            "Oversized Utility Jacket",
            "oversized-utility-jacket",
            "Jackets",
            "unisex",
            6999,
            8499,
            30,
        ),

        (
            "Technical Shell",
            "technical-shell",
            "Jackets",
            "unisex",
            7999,
            9499,
            25,
        ),

        (
            "Everyday Cargo Shorts",
            "everyday-cargo-shorts",
            "Shorts",
            "unisex",
            2999,
            3699,
            45,
        ),

        (
            "Utility Vest Pro",
            "utility-vest-pro",
            "Streetwear",
            "unisex",
            4499,
            5499,
            35,
        ),


        # ========================================================
        # STREETWEAR
        # ========================================================

        (
            "Archive Varsity Jacket",
            "archive-varsity-jacket",
            "Streetwear",
            "unisex",
            7499,
            8999,
            25,
        ),

        (
            "Street Utility Hoodie",
            "street-utility-hoodie",
            "Streetwear",
            "unisex",
            4499,
            5499,
            40,
        ),

        (
            "Graphic Archive Tee",
            "graphic-archive-tee",
            "Streetwear",
            "unisex",
            2499,
            2999,
            50,
        ),

        (
            "Multi Pocket Cargo",
            "multi-pocket-cargo",
            "Streetwear",
            "unisex",
            4999,
            5999,
            35,
        ),

        (
            "Street Utility Vest",
            "street-utility-vest",
            "Streetwear",
            "unisex",
            3999,
            4999,
            30,
        ),


        # ========================================================
        # SNEAKERS
        # ========================================================

        (
            "NØVA Court Runner",
            "nova-court-runner",
            "Sneakers",
            "unisex",
            5999,
            6999,
            40,
        ),

        (
            "NØVA Urban Runner",
            "nova-urban-runner",
            "Sneakers",
            "unisex",
            6499,
            7499,
            35,
        ),

        (
            "NØVA Street Low",
            "nova-street-low",
            "Sneakers",
            "unisex",
            5499,
            6499,
            45,
        ),

        (
            "NØVA Retro Runner",
            "nova-retro-runner",
            "Sneakers",
            "unisex",
            6299,
            7499,
            35,
        ),

        (
            "NØVA Trail Pro",
            "nova-trail-pro",
            "Sneakers",
            "unisex",
            6999,
            8499,
            30,
        ),


        # ========================================================
        # ACCESSORIES
        # ========================================================

        (
            "NØVA Mini Shoulder Bag",
            "nova-mini-shoulder-bag",
            "Accessories",
            "women",
            2499,
            2999,
            40,
        ),

        (
            "NØVA Utility Bag",
            "nova-utility-bag",
            "Accessories",
            "unisex",
            2999,
            3699,
            45,
        ),

        (
            "NØVA Crossbody Pro",
            "nova-crossbody-pro",
            "Accessories",
            "unisex",
            3299,
            3999,
            35,
        ),

        (
            "NØVA Archive Cap",
            "nova-archive-cap",
            "Accessories",
            "unisex",
            1299,
            1699,
            60,
        ),

        (
            "NØVA Logo Beanie",
            "nova-logo-beanie",
            "Accessories",
            "unisex",
            1499,
            1899,
            55,
        ),

        (
            "NØVA Card Holder",
            "nova-card-holder",
            "Accessories",
            "unisex",
            1699,
            2199,
            50,
        ),

        (
            "NØVA Leather Belt",
            "nova-leather-belt",
            "Accessories",
            "unisex",
            1999,
            2499,
            40,
        ),

        (
            "NØVA Travel Duffle",
            "nova-travel-duffle",
            "Accessories",
            "unisex",
            3999,
            4999,
            30,
        ),
    ]


    # ============================================================
    # CATEGORY LIST
    # ============================================================

    categories = [
        "Jackets",
        "Hoodies",
        "T-Shirts",
        "Pants",
        "Shorts",
        "Sneakers",
        "Accessories",
        "Streetwear",
    ]


    # ============================================================
    # HANDLE
    # ============================================================

    def handle(self, *args, **kwargs):

        media_path = Path(
            "media/products"
        )


        # ========================================================
        # CREATE CATEGORIES
        # ========================================================

        category_objects = {}


        for category_name in self.categories:

            category, created = (
                Category.objects.get_or_create(
                    slug=category_name
                    .lower()
                    .replace(" ", "-"),

                    defaults={
                        "name": category_name,
                        "description":
                            f"NØVA {category_name} collection",
                    },
                )
            )

            category_objects[
                category_name
            ] = category


        # ========================================================
        # CREATE / UPDATE PRODUCTS
        # ========================================================

        for (
            name,
            slug,
            category_name,
            gender,
            price,
            original_price,
            stock,
        ) in self.products:

            product, created = (
                Product.objects.update_or_create(

                    slug=slug,

                    defaults={

                        "category":
                            category_objects[
                                category_name
                            ],

                        "name":
                            f"NØVA {name}",

                        "description":
                            (
                                f"Premium {name.lower()} "
                                "from the NØVA fashion "
                                "collection."
                            ),

                        "price":
                            price,

                        "original_price":
                            original_price,

                        "brand":
                            "NØVA",

                        "stock":
                            stock,

                        "gender":
                            gender,

                        "is_active":
                            True,
                    },
                )
            )


            # ====================================================
            # PRODUCT VARIANTS
            # ====================================================

            sizes = [
                "S",
                "M",
                "L",
                "XL",
            ]

            colors = [
                "Black",
                "White",
                "Gray",
            ]


            for size in sizes:

                for color in colors:

                    ProductVariant.objects.get_or_create(

                        product=product,

                        size=size,

                        color=color,

                        defaults={
                            "stock": stock // 12
                        },

                    )


            # ====================================================
            # PRODUCT IMAGES
            # ====================================================

            for image_number in [1, 2]:

                filename = (
                    f"{slug}-{image_number}.jpg"
                )

                image_path = (
                    media_path / filename
                )


                if not image_path.exists():

                    self.stdout.write(
                        self.style.WARNING(
                            f"Image not found: {filename}"
                        )
                    )

                    continue


                image_reference = (
                    f"products/{filename}"
                )


                if not ProductImage.objects.filter(
                    product=product,
                    image=image_reference,
                ).exists():

                    with open(
                        image_path,
                        "rb"
                    ) as image_file:

                        ProductImage.objects.create(

                            product=product,

                            image=File(
                                image_file,
                                name=filename,
                            ),

                            is_primary=(
                                image_number == 1
                            ),
                        )


            # ====================================================
            # OUTPUT
            # ====================================================

            if created:

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created: {product.name}"
                    )
                )

            else:

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Updated: {product.name}"
                    )
                )


        # ========================================================
        # FINISHED
        # ========================================================

        total = Product.objects.count()

        self.stdout.write("")

        self.stdout.write(
            self.style.SUCCESS(
                f"NØVA product import complete!"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Total products in database: {total}"
            )
        )