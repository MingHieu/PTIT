INSERT INTO public.electricity_service(id, name)
VALUES (1, 'Điện sinh hoạt');

INSERT INTO public.electricity_service(id, name)
VALUES (2, 'Điện sản xuất');

INSERT INTO public.electricity_service(id, name)
VALUES (3, 'Điện mặt trời');

INSERT INTO public.price(id, from_value, to_value, price, electricity_service_id)
VALUES (1, 0, 50, 1806, 1);

INSERT INTO public.price(id, from_value, to_value, price, electricity_service_id)
VALUES (2, 50, 100, 1866, 1);

INSERT INTO public.price(id, from_value, to_value, price, electricity_service_id)
VALUES (3, 100, 200, 2167, 1);

INSERT INTO public.price(id, from_value, to_value, price, electricity_service_id)
VALUES (4, 200, 300, 2729, 1);

INSERT INTO public.price(id, from_value, to_value, price, electricity_service_id)
VALUES (5, 300, 400, 3050, 1);

INSERT INTO public.price(id, from_value, to_value, price, electricity_service_id)
VALUES (6, 400, null, 3151, 1);

INSERT INTO public.tax(id, name, value)
VALUES (1, 'VAT', 10);