<?php
/* ----- config.php ----- */
// Place this file in a 'config' folder

$host   = 'localhost';
$dbname = 'your_database_name';    // change to your DB name
$user   = 'your_username';         // change to your DB user
$pass   = 'your_password';         // change to your DB password
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}

/* ----- product.php ----- */
// Place at your web root. Handles list/add/edit/delete based on `action` param

require_once __DIR__ . '/config/config.php';

action:
$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'add':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $name  = $_POST['name'];
            $price = $_POST['price'];
            $stmt = $pdo->prepare("INSERT INTO products (name, price) VALUES (?, ?)");
            $stmt->execute([$name, $price]);
            header('Location: product.php'); exit;
        }
        include 'templates/form.php';
        break;

    case 'edit':
        $id = (int)($_GET['id'] ?? 0);
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $name  = $_POST['name'];
            $price = $_POST['price'];
            $stmt = $pdo->prepare("UPDATE products SET name = ?, price = ? WHERE id = ?");
            $stmt->execute([$name, $price, $id]);
            header('Location: product.php'); exit;
        }
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        include 'templates/form.php';
        break;

    case 'delete':
        $id = (int)($_GET['id'] ?? 0);
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        header('Location: product.php'); exit;
        break;

    case 'list':
    default:
        $stmt = $pdo->query("SELECT * FROM products");
        $products = $stmt->fetchAll();
        include 'templates/list.php';
        break;
}

/* ----- templates/list.php ----- */
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

<?php /* ----- templates/form.php ----- */ ?>
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