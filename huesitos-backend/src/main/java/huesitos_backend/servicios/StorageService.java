package huesitos_backend.servicios;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.UUID;
import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.FileImageOutputStream;

@Service
public class StorageService {

    private final String UPLOAD_DIR = "uploads/";
    private final String CLINICOS_DIR = "uploads/clinicos/";

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
            Files.createDirectories(Paths.get(CLINICOS_DIR));
        } catch (IOException e) {
            throw new RuntimeException("No se pudieron crear las carpetas de uploads", e);
        }
    }

    /**
     * Comprime y guarda una foto recibida en la carpeta de uploads.
     */
    public String comprimirYGuardarFoto(MultipartFile archivo, String prefijo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new RuntimeException("El archivo está vacío");
        }

        try {
            // 1. Leer imagen en memoria
            BufferedImage imagenOriginal = ImageIO.read(archivo.getInputStream());
            if (imagenOriginal == null) {
                throw new RuntimeException("El archivo no es una imagen válida");
            }

            // 2. Redimensionar si supera los 1200px de ancho
            BufferedImage imagenFinal = redimensionarSiEsNecesario(imagenOriginal, 1200);

            // 3. Nombre único del archivo
            String nombreArchivo = prefijo + "_" + UUID.randomUUID().toString() + ".webp";

            // 4. Configurar ImageWriter para compresión WebP (75% de calidad)
            File outputFile = new File(UPLOAD_DIR + nombreArchivo);
            guardarConCompresion(imagenFinal, outputFile);

            // 5. Retornar la URL relativa
            return "/uploads/" + nombreArchivo;

        } catch (IOException e) {
            throw new RuntimeException("Error al procesar y guardar la imagen", e);
        }
    }

    private BufferedImage redimensionarSiEsNecesario(BufferedImage original, int maxAncho) {
        int anchoOriginal = original.getWidth();
        int altoOriginal = original.getHeight();

        if (anchoOriginal <= maxAncho) {
            return original;
        }

        double ratio = (double) maxAncho / anchoOriginal;
        int nuevoAncho = maxAncho;
        int nuevoAlto = (int) (altoOriginal * ratio);

        // Conservar transparencia si el original la tiene
        int tipo = original.getColorModel().hasAlpha() ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB;
        BufferedImage redimensionada = new BufferedImage(nuevoAncho, nuevoAlto, tipo);
        Graphics2D g2d = redimensionada.createGraphics();
        
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.drawImage(original, 0, 0, nuevoAncho, nuevoAlto, null);
        g2d.dispose();

        return redimensionada;
    }

    private void guardarConCompresion(BufferedImage imagen, File outputFile) throws IOException {
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("webp");
        if (!writers.hasNext()) {
            throw new RuntimeException("No se encontró un escritor de imágenes para WebP. Verifica la dependencia de Maven.");
        }
        
        ImageWriter writer = writers.next();
        ImageWriteParam param = writer.getDefaultWriteParam();
        param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        
        // Configurar tipo de compresión explícita para evitar "No compression type set!"
        String[] types = param.getCompressionTypes();
        if (types != null && types.length > 0) {
            String tipoSeleccionado = types[0];
            for (String t : types) {
                if (t.equalsIgnoreCase("Lossy")) {
                    tipoSeleccionado = t;
                    break;
                }
            }
            param.setCompressionType(tipoSeleccionado);
        }
        
        param.setCompressionQuality(0.88f); // 88% de calidad para WebP — balance calidad/peso

        try (FileImageOutputStream outputStream = new FileImageOutputStream(outputFile)) {
            writer.setOutput(outputStream);
            writer.write(null, new IIOImage(imagen, null, null), param);
        } finally {
            writer.dispose();
        }
    }

    /**
     * Guarda un archivo clínico de forma genérica (PDF, imágenes, etc.) en uploads/clinicos/
     * sin alterar ni comprimir su contenido.
     */
    public String guardarArchivoClinico(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new RuntimeException("El archivo está vacío");
        }

        try {
            // Nombre original y extensión
            String nombreOriginal = archivo.getOriginalFilename();
            String extension = "";
            if (nombreOriginal != null && nombreOriginal.contains(".")) {
                extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
            }

            // Nombre único con UUID
            String nombreArchivo = UUID.randomUUID().toString() + extension;

            // Ruta de guardado
            File destino = new File(CLINICOS_DIR + nombreArchivo);
            archivo.transferTo(destino);

            // URL relativa de acceso
            return "/uploads/clinicos/" + nombreArchivo;
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo clínico", e);
        }
    }

    /**
     * Borra una foto del almacenamiento si no es la de por defecto.
     */
    public void borrarFoto(String urlFoto) {
        if (urlFoto == null || urlFoto.isBlank() || urlFoto.contains("defecto-")) {
            return;
        }

        try {
            String rutaRelativa = urlFoto.startsWith("/") ? urlFoto.substring(1) : urlFoto;
            java.nio.file.Path rutaArchivo = Paths.get(rutaRelativa);
            if (Files.exists(rutaArchivo)) {
                Files.delete(rutaArchivo);
            }
        } catch (IOException e) {
            System.err.println("No se pudo borrar el archivo: " + urlFoto + ". Error: " + e.getMessage());
        }
    }
}
