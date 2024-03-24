-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-03-2024 a las 04:29:08
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `farmacia_santa_rosita`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(10, 'Bienestar general'),
(8, 'Cuidado bucal'),
(7, 'Cuidado de la piel'),
(5, 'Cuidado del bebé'),
(3, 'Cuidado personal'),
(2, 'Medicamentos con receta'),
(1, 'Medicamentos sin receta'),
(6, 'Primeros auxilios'),
(9, 'Salud femenina'),
(4, 'Vitaminas y suplementos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `expiration`
--

CREATE TABLE `expiration` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `expiration_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `product_code` varchar(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `initial_stock` int(11) DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `lot_number` varchar(20) DEFAULT NULL,
  `nutritional_information` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `current_stock` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `create_by` int(11) NOT NULL,
  `storage_location_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `image`, `name`, `product_code`, `description`, `price`, `initial_stock`, `expiration_date`, `supplier_id`, `lot_number`, `nutritional_information`, `notes`, `category_id`, `current_stock`, `created_at`, `updated_at`, `create_by`, `storage_location_id`) VALUES
(1, 'https://farmasmart.com/wp-content/uploads/2022/05/PARACETAMOL-500-MG-10-TABLETAS.jpg', 'Paracetamol', 'PCT001', 'Analgésico y antipirético', 5.99, 200, '2024-12-31', 1, 'L001', 'Información nutricional: No aplicable', 'Tomar con agua', 1, 150, '2024-03-08 16:00:00', '2024-03-08 04:01:33', 1, NULL),
(2, 'https://quefarmacia.com/wp-content/uploads/2017/04/7502223708136_1.jpg', 'Ibuprofeno', 'IBP002', 'Antiinflamatorio no esteroideo', 8.49, 150, '2024-12-31', 2, 'L002', 'Información nutricional: No aplicable', 'Tomar después de las comidas', 1, 100, '2024-03-08 16:15:00', '2024-03-08 04:01:33', 2, NULL),
(3, 'https://th.bing.com/th/id/OIP.xnya9FqpI7Pz3q61O3wyRwHaHa?rs=1&pid=ImgDetMain', 'Vitamina C', 'VITC003', 'Suplemento vitamínico', 12.99, 100, '2024-12-31', 3, 'L003', 'Información nutricional: Contiene vitamina C', 'No exceder la dosis diaria recomendada', 2, 50, '2024-03-08 16:30:00', '2024-03-08 04:01:33', 2, NULL),
(4, 'https://th.bing.com/th/id/OIP.Km6_o-BK5z0xrqB1jwGiewHaE8?w=1000&h=667&rs=1&pid=ImgDetMain', 'Amoxicilina', 'AMX004', 'Antibiótico de amplio espectro', 15.99, 120, '2024-12-31', 2, 'L004', 'Información nutricional: No aplicable', 'Tomar según indicaciones médicas', 3, 80, '2024-03-08 16:45:00', '2024-03-08 04:01:33', 1, NULL),
(5, 'https://http2.mlstatic.com/D_NQ_NP_822630-MLA43645404725_102020-F.jpg', 'Pasta dental', 'DNTL005', 'Protección contra caries y placa', 3.49, 300, '2025-06-30', 2, 'L005', 'Información nutricional: No aplicable', 'Cepillar los dientes dos veces al día', 4, 250, '2024-03-08 17:00:00', '2024-03-08 04:01:33', 2, NULL),
(6, 'https://th.bing.com/th/id/OIP.3flaMJTy9KxWOBwYL4Rg3AHaHa?rs=1&pid=ImgDetMain', 'Ampolla de vitamina B12', 'VITB006', 'Suplemento de vitamina B12', 18.75, 50, '2023-12-31', 3, 'L006', 'Información nutricional: Contiene vitamina B12', 'Usar según recomendación médica', 2, 30, '2024-03-08 17:15:00', '2024-03-08 04:01:33', 1, NULL),
(7, '', 'Jabón antibacterial', 'SOAP007', 'Limpieza y protección contra gérmenes', 2.99, 200, '2024-09-30', 1, 'L007', 'Información nutricional: No aplicable', 'Usar para lavado de manos frecuente', 5, 150, '2024-03-08 17:30:00', '2024-03-08 17:30:00', 2, NULL),
(8, '', 'awdw', '12213', 'dwaadw', 12.00, 23, '2024-03-16', 2, '12123', 'adwwda', '1wdaawd', 1, 23, '2024-03-22 23:07:57', '2024-03-13 23:07:57', 0, 6),
(9, '', 'dawdaw', '32', 'dawawd', 23.00, 13, '2024-03-21', 2, '32', 'wdawad', 'dawadw', 8, 13, '2024-03-12 23:09:12', '2024-03-12 23:09:12', 0, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'Administrador'),
(2, 'Farmacéutico'),
(3, 'Empleado de Almacén');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `quantity` int(11) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `statuses`
--

CREATE TABLE `statuses` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `statuses`
--

INSERT INTO `statuses` (`id`, `name`) VALUES
(1, 'Activo'),
(2, 'Inactivo'),
(3, 'Suspendido');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stock_adjustments`
--

CREATE TABLE `stock_adjustments` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `adjusted_quantity` int(11) DEFAULT NULL,
  `adjustment_type` enum('entry','exit') DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `storage_locations`
--

CREATE TABLE `storage_locations` (
  `id` int(11) NOT NULL,
  `location` varchar(50) DEFAULT NULL,
  `additional_info` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `storage_locations`
--

INSERT INTO `storage_locations` (`id`, `location`, `additional_info`) VALUES
(1, 'Estantería A', 'Fila 1, Estante Superior'),
(2, 'Mostrador', 'Área de Ventas'),
(3, 'Almacén B', 'Estante 3, Sección 2'),
(4, 'Estantería C', 'Fila 2, Estante Medio'),
(5, 'Farmacia Trasera', 'Almacén de Productos de Limpieza'),
(6, 'Vitrina Principal', 'Productos de Exhibición'),
(7, 'Mostrador de Atención', 'Área de Atención al Cliente'),
(8, 'Almacén A', 'Estante 1, Sección 1'),
(9, 'Góndola Central', 'Pasillo Principal'),
(10, 'Estantería D', 'Fila 3, Estante Inferior');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `suppliers`
--

INSERT INTO `suppliers` (`id`, `name`, `address`, `phone_number`) VALUES
(1, 'Proveedor A', 'Calle Principal 123, Ciudad', '+1234567890'),
(2, 'Proveedor B', 'Avenida Secundaria 456, Ciudad', '+9876543210'),
(3, 'Proveedor C', 'Plaza Central 789, Ciudad', '+1112233445');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `ci` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `status_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `ci`, `name`, `email`, `password`, `image`, `role_id`, `status_id`) VALUES
(1, 'luwin', 13336901, 'Ludwing khjk', 'ludwingarmijosaavedra@gmail.com', 'ludwing', '/pixelgate.png', 1, 1),
(2, 'admin', 999999999, 'Admin', 'admin@gmail.com', 'admin', '/pp.jpg', 1, 1),
(3, 'adminawdawd', 54646312, 'Admin', 'aaaaaaa', 'admin', '', 1, 1),
(4, 'aewaw', 2, 'awddwa', 'adsaw', 'prueba', '', 1, 1),
(5, 'aewaw', 2, 'awddwa', 'adsaw', 'prueba', '', 1, 1),
(6, 'aewawdawwda', 2, 'awddwa', 'adsaw', 'prueba', '', 1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `expiration`
--
ALTER TABLE `expiration`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_code` (`product_code`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `product_location_id` (`storage_location_id`);

--
-- Indices de la tabla `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `statuses`
--
ALTER TABLE `statuses`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `stock_adjustments`
--
ALTER TABLE `stock_adjustments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indices de la tabla `storage_locations`
--
ALTER TABLE `storage_locations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `statuses`
--
ALTER TABLE `statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `storage_locations`
--
ALTER TABLE `storage_locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `expiration`
--
ALTER TABLE `expiration`
  ADD CONSTRAINT `expiration_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Filtros para la tabla `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`storage_location_id`) REFERENCES `storage_locations` (`id`);

--
-- Filtros para la tabla `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Filtros para la tabla `stock_adjustments`
--
ALTER TABLE `stock_adjustments`
  ADD CONSTRAINT `stock_adjustments_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
