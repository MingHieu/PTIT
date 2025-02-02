package com.ktpm.workflowservice.repository.custom;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ktpm.workflowservice.vo.InvoiceModelResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class InvoiceRepositoryCustom {

    private final EntityManager entityManager;

    public HashMap<Integer, List<InvoiceModelResponse>> findAllByCreatedAtBetween(Date from, Date to) {
        String querySql = """
                WITH ranked_records AS (SELECT i.*,
                                               a.id                                                                  AS apartment_id,
                                               a.owner_id                                                            as customer_id,
                                               ROW_NUMBER() OVER (PARTITION BY c.apartment_id ORDER BY i.created_at) AS row_num
                                        FROM invoice i,
                                             contract c,
                                             apartment a
                                        WHERE i.contract_id = c.id
                                          AND c.apartment_id = a.id
                                          AND (i.created_at BETWEEN :from AND :to)),
                     invoice_procesed AS (SELECT r1.id,
                                                 r1.contract_id,
                                                 r1.created_at,
                                                 r1.from_date,
                                                 r1.to_date,
                                                 r1.electricity_usage_number                AS new_electricity_usage,
                                                 (CASE
                                                      WHEN r1.row_num = 1 THEN 0
                                                      ELSE r2.electricity_usage_number END) AS old_electricity_usage,
                                                 r1.customer_id
                                          FROM ranked_records r1,
                                               ranked_records r2
                                          WHERE r1.apartment_id = r2.apartment_id
                                            AND (r1.row_num - r2.row_num = 1 OR (r1.row_num = 1 AND r2.row_num = 1))),
                     tax_processed AS (SELECT ARRAY_AGG(JSONB_BUILD_OBJECT('id', t.id,
                                                                           'name', t.name,
                                                                           'value', it.value)) AS taxes,
                                              i.id                                             AS invoice_id
                                       FROM invoice i,
                                            invoice_tax it,
                                            tax t
                                       WHERE it.invoice_id = i.id
                                         AND it.tax_id = t.id
                                       GROUP BY i.id),
                     invoices as (SELECT EXTRACT(MONTH FROM i.created_at) AS month,
                                         JSON_BUILD_OBJECT(
                                                 'id', i.id,
                                                 'createdAt', i.created_at,
                                                 'fromDate', i.from_date,
                                                 'toDate', i.to_date,
                                                 'oldElectricityUsage', i.old_electricity_usage,
                                                 'newElectricityUsage', i.new_electricity_usage,
                                                 'customerId', i.customer_id
                                         )                                AS invoice,
                                         JSON_BUILD_OBJECT(
                                                 'id', c.id
                                         )                                AS contract,
                                         JSON_BUILD_OBJECT(
                                                 'id', a.id,
                                                 'address', a.address
                                         )                                as apartment,
                                         JSON_BUILD_OBJECT(
                                                 'name', es.name,
                                                 'description', es.description
                                         )                                AS electricityService,
                                         JSON_AGG(JSON_BUILD_OBJECT(
                                                 'fromValue', ip.from_value,
                                                 'toValue', ip.to_value,
                                                 'price', ip.price
                                                  ))                      AS prices,
                                         tp.taxes                         AS taxes
                                  FROM invoice_procesed i,
                                       apartment a,
                                       contract c,
                                       electricity_service es,
                                       invoice_price ip,
                                       tax_processed tp
                                  WHERE i.contract_id = c.id
                                    AND c.apartment_id = a.id
                                    AND c.electricity_service_id = es.id
                                    AND i.id = ip.invoice_id
                                    AND i.id = tp.invoice_id
                                  GROUP BY i.id, i.created_at, i.from_date, i.to_date, i.old_electricity_usage, i.new_electricity_usage,
                                           i.customer_id, c.id, a.id, a.address, es.name, es.description, tp.taxes
                                  ORDER BY i.created_at)
                SELECT month,
                       JSON_AGG(JSON_BUILD_OBJECT(
                               'invoice', invoice,
                               'contract', contract,
                               'apartment', apartment,
                               'electricityService', electricityService,
                               'prices', prices,
                               'taxes', taxes
                                ))
                FROM invoices
                GROUP BY month;
                """;
        Query query = entityManager.createNativeQuery(querySql);
        query.setParameter("from", from);
        query.setParameter("to", to);

        HashMap<Integer, List<InvoiceModelResponse>> response = new HashMap<>();
        query.getResultList().forEach(result -> {
            Object[] array = (Object[]) result;
            try {
                response.put(((BigDecimal) array[0]).intValue(), new ObjectMapper().readValue((String) array[1], new TypeReference<List<InvoiceModelResponse>>() {
                }));
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        });
        return response;
    }

}
