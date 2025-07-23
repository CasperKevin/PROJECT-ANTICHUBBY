<?php?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title><?= $action === 'add' ? 'Thêm' : 'Sửa' ?> sản phẩm</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
</head>

<body class="p-4">
    <div class="container">
        <h1><?= $action === 'add' ? 'Thêm' : 'Sửa' ?> sản phẩm</h1>
        <form method="post" action="">
            <div class="mb-3">
                <label class="form-label">Tên</label>
                <input type="text" name="name" class="form-control" required value="<?= $product['name'] ?? '' ?>">
            </div>
            <div class="mb-3">
                <label class="form-label">Giá</label>
                <input type="number" step="0.01" name="price" class="form-control" required
                    value="<?= $product['price'] ?? '' ?>">
            </div>
            <button type="submit" class="btn btn-success"><?= $action === 'add' ? 'Thêm' : 'Cập nhật' ?></button>
            <a href="product.php" class="btn btn-secondary">Hủy</a>
        </form>
    </div>
</body>

</html>