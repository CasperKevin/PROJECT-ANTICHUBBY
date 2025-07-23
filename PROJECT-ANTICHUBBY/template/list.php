<?php
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Product Management</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
</head>

<body class="p-4">
    <div class="container">
        <h1>Sản phẩm</h1>
        <a href="product.php?action=add" class="btn btn-primary mb-3">Thêm sản phẩm</a>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($products as $p): ?>
                <tr>
                    <td><?= $p['id'] ?></td>
                    <td><?= htmlspecialchars($p['name']) ?></td>
                    <td><?= htmlspecialchars($p['price']) ?></td>
                    <td>
                        <a href="product.php?action=edit&id=<?= $p['id'] ?>" class="btn btn-sm btn-warning">Sửa</a>
                        <a href="product.php?action=delete&id=<?= $p['id'] ?>" class="btn btn-sm btn-danger"
                            onclick="return confirm('Chắc chứ?');">Xóa</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</body>

</html>