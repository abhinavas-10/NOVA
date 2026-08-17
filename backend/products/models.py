from django.db import models


class Category(models.Model):

    name = models.CharField(
        max_length=100
    )

    slug = models.SlugField(
        unique=True
    )

    description = models.TextField(
        blank=True
    )

    image = models.ImageField(
        upload_to='categories/',
        blank=True,
        null=True
    )

    def __str__(self):
        return self.name


class Product(models.Model):

    GENDER_CHOICES = [
        ('men', 'Men'),
        ('women', 'Women'),
        ('unisex', 'Unisex'),
    ]

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products'
    )

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        default='unisex'
    )

    name = models.CharField(
        max_length=200
    )

    slug = models.SlugField(
        unique=True
    )

    description = models.TextField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    original_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    brand = models.CharField(
        max_length=100,
        default='NØVA'
    )

    stock = models.PositiveIntegerField(
        default=0
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name


class ProductImage(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images'
    )

    image = models.ImageField(
        upload_to='products/'
    )

    is_primary = models.BooleanField(
        default=False
    )

    def __str__(self):
        return (
            f"{self.product.name} image"
        )


class ProductVariant(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants'
    )

    color = models.CharField(
        max_length=50,
        blank=True
    )

    size = models.CharField(
        max_length=20,
        blank=True
    )

    stock = models.PositiveIntegerField(
        default=0
    )

    def __str__(self):
        return (
            f"{self.product.name} - "
            f"{self.color} - "
            f"{self.size}"
        )