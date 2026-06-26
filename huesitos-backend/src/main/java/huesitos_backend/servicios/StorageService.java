package huesitos_backend.servicios;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StorageService {

    private final Cloudinary cloudinary;

    /**
     * Sube una foto a Cloudinary optimizándola y limitando el tamaño a 1200px.
     */
    public String comprimirYGuardarFoto(MultipartFile archivo, String prefijo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new RuntimeException("El archivo está vacío");
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(archivo.getBytes(), ObjectUtils.asMap(
                "folder", "huesitos",
                "resource_type", "image",
                "transformation", new Transformation()
                    .width(1200)
                    .crop("limit")
                    .quality("auto")
                    .fetchFormat("auto")
            ));

            return (String) uploadResult.get("secure_url");

        } catch (IOException e) {
            throw new RuntimeException("Error al procesar y guardar la imagen en Cloudinary", e);
        }
    }

    /**
     * Guarda un archivo clínico de forma genérica (PDF, imágenes, etc.) en Cloudinary.
     */
    public String guardarArchivoClinico(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new RuntimeException("El archivo está vacío");
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(archivo.getBytes(), ObjectUtils.asMap(
                "folder", "huesitos/clinicos",
                "resource_type", "auto"
            ));

            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo clínico en Cloudinary", e);
        }
    }

    /**
     * Borra una foto de Cloudinary o del almacenamiento local si es antigua.
     */
    public void borrarFoto(String urlFoto) {
        if (urlFoto == null || urlFoto.isBlank() || urlFoto.contains("defecto-")) {
            return;
        }

        try {
            if (urlFoto.contains("cloudinary.com")) {
                String publicId = extraerPublicId(urlFoto);
                if (publicId != null) {
                    String resourceType = urlFoto.contains("/raw/") ? "raw" : (urlFoto.contains("/video/") ? "video" : "image");
                    cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", resourceType));
                }
            } else {
                // Compatibilidad con archivos locales anteriores
                String rutaRelativa = urlFoto.startsWith("/") ? urlFoto.substring(1) : urlFoto;
                java.nio.file.Path rutaArchivo = Paths.get(rutaRelativa);
                if (Files.exists(rutaArchivo)) {
                    Files.delete(rutaArchivo);
                }
            }
        } catch (Exception e) {
            System.err.println("No se pudo borrar el archivo: " + urlFoto + ". Error: " + e.getMessage());
        }
    }

    /**
     * Extrae el public_id de una URL de Cloudinary para poder borrar la imagen.
     */
    private String extraerPublicId(String url) {
        try {
            int idxUpload = url.indexOf("/upload/");
            if (idxUpload == -1) return null;

            String path = url.substring(idxUpload + 8);

            if (path.startsWith("v")) {
                int primerSlash = path.indexOf("/");
                if (primerSlash != -1) {
                    path = path.substring(primerSlash + 1);
                }
            }

            int ultimoPunto = path.lastIndexOf(".");
            if (ultimoPunto != -1) {
                path = path.substring(0, ultimoPunto);
            }

            return path;
        } catch (Exception e) {
            return null;
        }
    }
}
