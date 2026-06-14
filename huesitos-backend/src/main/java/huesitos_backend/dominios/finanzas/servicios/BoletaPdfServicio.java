package huesitos_backend.dominios.finanzas.servicios;

import huesitos_backend.dominios.mascota.entidades.Mascota;
import huesitos_backend.dominios.veterinaria_servicio.entidades.Servicio;
import huesitos_backend.dominios.finanzas.entidades.EstadoPago;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import huesitos_backend.dominios.finanzas.entidades.Transaccion;
import huesitos_backend.dominios.finanzas.repositorios.TransaccionRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class BoletaPdfServicio {

    private final TransaccionRepositorio transaccionRepositorio;

    /**
     * Genera un archivo PDF para la boleta de pago de una transacción específica.
     *
     * @param transaccionId El ID de la transacción.
     * @return El PDF en arreglo de bytes.
     */
    @Transactional(readOnly = true)
    public byte[] generarPdfBoleta(Long transaccionId) {
        Transaccion transaccion = transaccionRepositorio.findById(transaccionId)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));

        if (transaccion.getEstadoPago() != EstadoPago.APROBADO) {
            throw new RuntimeException("No se puede generar boleta para una transacción no aprobada");
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A5);
        document.setMargins(20, 20, 20, 20);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // 1. Cabecera de la veterinaria
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, new Color(44, 62, 80));
            Paragraph header = new Paragraph("VETERINARIA HUESITOS 🐶", titleFont);
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);

            Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 8, new Color(127, 140, 141));
            Paragraph subheader = new Paragraph("R.U.C. N° 20123456789\nCalle de las Mascotas 123 - San Borja\nContacto: info@huesitos.com | (01) 456-7890", subFont);
            subheader.setAlignment(Element.ALIGN_CENTER);
            subheader.setSpacingAfter(10);
            document.add(subheader);

            // Línea divisoria
            Paragraph separator = new Paragraph("____________________________________________________", subFont);
            separator.setSpacingAfter(10);
            document.add(separator);

            // 2. Título de la Boleta
            Font docTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, new Color(46, 204, 113));
            Paragraph docTitle = new Paragraph("BOLETA DE PAGO ELECTRÓNICA", docTitleFont);
            docTitle.setAlignment(Element.ALIGN_CENTER);
            docTitle.setSpacingAfter(15);
            document.add(docTitle);

            // 3. Detalles de la Transacción / Boleta
            PdfPTable tableDetalles = new PdfPTable(2);
            tableDetalles.setWidthPercentage(100);
            tableDetalles.setSpacingAfter(15);

            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, new Color(44, 62, 80));
            Font valueFont = FontFactory.getFont(FontFactory.HELVETICA, 9, new Color(51, 51, 51));

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
            String fechaStr = transaccion.getFechaPago() != null ? transaccion.getFechaPago().format(formatter) : "-";

            tableDetalles.addCell(crearCeldaSinBorde("Boleta N°: B001-" + String.format("%06d", transaccion.getId()), labelFont, valueFont));
            tableDetalles.addCell(crearCeldaSinBorde("Fecha Emisión: " + fechaStr, labelFont, valueFont));

            tableDetalles.addCell(crearCeldaSinBorde("Cliente: " + transaccion.getCita().getMascota().getDueño().getNombreCompleto(), labelFont, valueFont));
            tableDetalles.addCell(crearCeldaSinBorde("Medio de Pago: " + transaccion.getMedioPago().toString(), labelFont, valueFont));

            tableDetalles.addCell(crearCeldaSinBorde("Mascota: " + transaccion.getCita().getMascota().getNombre() + " (" + transaccion.getCita().getMascota().getEspecie() + ")", labelFont, valueFont));
            String pasarelaId = transaccion.getIdTransaccionPasarela() != null ? transaccion.getIdTransaccionPasarela() : "Pago Presencial";
            tableDetalles.addCell(crearCeldaSinBorde("ID Transacción: " + pasarelaId, labelFont, valueFont));

            document.add(tableDetalles);
            document.add(separator);

            // 4. Detalle de los servicios cobrados
            PdfPTable tableItems = new PdfPTable(3);
            tableItems.setWidthPercentage(100);
            tableItems.setWidths(new float[]{60, 20, 20});
            tableItems.setSpacingAfter(20);

            // Encabezados de tabla de items
            Font tableHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);
            PdfPCell cellHeader1 = new PdfPCell(new Phrase("Descripción del Servicio", tableHeaderFont));
            cellHeader1.setBackgroundColor(new Color(44, 62, 80));
            cellHeader1.setPadding(6);
            cellHeader1.setHorizontalAlignment(Element.ALIGN_LEFT);

            PdfPCell cellHeader2 = new PdfPCell(new Phrase("Cant.", tableHeaderFont));
            cellHeader2.setBackgroundColor(new Color(44, 62, 80));
            cellHeader2.setPadding(6);
            cellHeader2.setHorizontalAlignment(Element.ALIGN_CENTER);

            PdfPCell cellHeader3 = new PdfPCell(new Phrase("Total", tableHeaderFont));
            cellHeader3.setBackgroundColor(new Color(44, 62, 80));
            cellHeader3.setPadding(6);
            cellHeader3.setHorizontalAlignment(Element.ALIGN_RIGHT);

            tableItems.addCell(cellHeader1);
            tableItems.addCell(cellHeader2);
            tableItems.addCell(cellHeader3);

            // Fila de Item
            PdfPCell cellItem = new PdfPCell(new Phrase(transaccion.getCita().getServicio().getNombre(), valueFont));
            cellItem.setPadding(6);
            tableItems.addCell(cellItem);

            PdfPCell cellCant = new PdfPCell(new Phrase("1", valueFont));
            cellCant.setPadding(6);
            cellCant.setHorizontalAlignment(Element.ALIGN_CENTER);
            tableItems.addCell(cellCant);

            PdfPCell cellTotal = new PdfPCell(new Phrase("S/. " + transaccion.getMonto().toString(), valueFont));
            cellTotal.setPadding(6);
            cellTotal.setHorizontalAlignment(Element.ALIGN_RIGHT);
            tableItems.addCell(cellTotal);

            document.add(tableItems);

            // 5. Total a pagar destacado
            Font totalFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, new Color(44, 62, 80));
            Paragraph totalParagraph = new Paragraph("TOTAL PAGADO: S/. " + transaccion.getMonto().toString(), totalFont);
            totalParagraph.setAlignment(Element.ALIGN_RIGHT);
            totalParagraph.setSpacingAfter(30);
            document.add(totalParagraph);

            // 6. Mensaje de agradecimiento
            Font footerFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, new Color(127, 140, 141));
            Paragraph footer = new Paragraph("¡Gracias por confiar en nosotros para cuidar de su mascota! 🐾", footerFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Error al estructurar el documento PDF de la boleta", e);
        }

        return out.toByteArray();
    }

    private PdfPCell crearCeldaSinBorde(String textoCompleto, Font labelFont, Font valueFont) {
        String[] partes = textoCompleto.split(":", 2);
        Phrase frase = new Phrase();
        if (partes.length == 2) {
            frase.add(new Chunk(partes[0] + ":", labelFont));
            frase.add(new Chunk(partes[1], valueFont));
        } else {
            frase.add(new Chunk(textoCompleto, valueFont));
        }
        PdfPCell celda = new PdfPCell(frase);
        celda.setBorder(Rectangle.NO_BORDER);
        celda.setPaddingBottom(5);
        return celda;
    }
}
