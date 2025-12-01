package com.eventqr.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Controller để serve file ảnh từ đường dẫn trên máy tính
 */
@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
public class ImageController {

    /**
     * Endpoint để lấy ảnh theo đường dẫn đầy đủ
     * URL: http://localhost:8080/api/images/view?path=D:/EventQR_Images/uuid.jpg
     */
    @GetMapping("/view")
    public ResponseEntity<Resource> getImage(@RequestParam String path) {
        try {
            // Chuyển đổi đường dẫn thành Path object
            Path filePath = Paths.get(path).normalize();
            
            // Kiểm tra file có tồn tại không
            if (!Files.exists(filePath) || !Files.isReadable(filePath)) {
                System.err.println("❌ File không tồn tại hoặc không đọc được: " + path);
                return ResponseEntity.notFound().build();
            }
            
            // Tạo Resource từ file
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }
            
            // Xác định content type dựa vào extension
            String contentType = determineContentType(filePath);
            
            // Trả về file với header phù hợp
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filePath.getFileName().toString() + "\"")
                    .body(resource);
                    
        } catch (MalformedURLException e) {
            System.err.println("❌ Đường dẫn file không hợp lệ: " + path);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi đọc file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Xác định content type dựa vào file extension
     */
    private String determineContentType(Path filePath) {
        String filename = filePath.getFileName().toString().toLowerCase();
        
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.endsWith(".png")) {
            return "image/png";
        } else if (filename.endsWith(".gif")) {
            return "image/gif";
        } else if (filename.endsWith(".webp")) {
            return "image/webp";
        } else if (filename.endsWith(".svg")) {
            return "image/svg+xml";
        } else {
            return "application/octet-stream";
        }
    }
}

