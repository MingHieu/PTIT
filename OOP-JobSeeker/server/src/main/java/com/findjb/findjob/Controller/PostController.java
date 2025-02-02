package com.findjb.findjob.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.findjb.findjob.Fcm.FCMService;
import com.findjb.findjob.Repositories.UserRepository;
import com.findjb.findjob.Request.FcmNotification;
import com.findjb.findjob.Request.PostRequest;
import com.findjb.findjob.Responses.ObjectResponse;
import com.findjb.findjob.Responses.StatusResponse;
import com.findjb.findjob.Service.JPA.PostService;

@RestController
@RequestMapping("api/post")
public class PostController {
    @Autowired
    private PostService postService;

    @Autowired
    private FCMService fcmService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<Object> createNewPost(@RequestBody PostRequest postRequest) {
        postService.createNewPost(postRequest);
        return new ResponseEntity<Object>(new StatusResponse(true, "Tạo mới thành công"), HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<Object> getAllPost(@RequestParam(required = false) String enterprise,
            @RequestParam(name = "pageNo") Integer pageNo,
            @RequestParam(name = "pageSize", required = false) Integer pageSize,
            @RequestParam(name = "name", required = false) String name) {
        return new ResponseEntity<Object>(
                postService.getAllPostByEnterprise(enterprise, pageNo, pageSize, name),
                HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getDetailPost(@PathVariable Long id) {
        return new ResponseEntity<Object>(
                new ObjectResponse(true, "Lấy danh sách thành công", postService.getPostDetail(id)),
                HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updatePost(@PathVariable Long id,
            @RequestBody PostRequest postRequest) {
        postService.updatePost(id, postRequest);
        return new ResponseEntity<Object>(new StatusResponse(true, "Cập nhật thành công"), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return new ResponseEntity<Object>(new StatusResponse(true, "Xóa thành công"), HttpStatus.OK);
    }

    @PutMapping("/apply/{id}")
    public ResponseEntity<Object> applyPost(@PathVariable Long id) {
        postService.applyPost(id);
        return new ResponseEntity<Object>(new StatusResponse(true, "Thành công"), HttpStatus.OK);
    }

    @PutMapping("/{post_id}/approve/{freelancer_id}")
    public ResponseEntity<Object> approvePost(@PathVariable Long post_id, @PathVariable Long freelancer_id) {
        postService.approvePost(post_id, freelancer_id);
        try {
            String fcmToken = userRepository.findById(freelancer_id).get().getFcmToken();
            FcmNotification fcmNotification = new FcmNotification(fcmToken, "Đơn xin việc đã được chấp thuận",
                    "Hãy chờ đợi nhà tuyển dụng gửi thông tin đến cho bạn nhé", null);
            fcmService.pushNotification(fcmNotification);
        } catch (Exception e) {
        }
        return new ResponseEntity<Object>(new StatusResponse(true, "Thành công"), HttpStatus.OK);
    }

    @PutMapping("/{post_id}/reject/{freelancer_id}")
    public ResponseEntity<Object> rejectPost(@PathVariable Long post_id, @PathVariable Long freelancer_id) {
        postService.rejectPost(post_id, freelancer_id);
        String fcmToken = userRepository.findById(freelancer_id).get().getFcmToken();
        try {
            FcmNotification fcmNotification = new FcmNotification(fcmToken, "Đơn xin việc đã bị từ chối",
                    "Hãy cải thiện lại hồ sơ của bạn và ứng tuyển lại nhé", null);
            fcmService.pushNotification(fcmNotification);
        } catch (Exception e) {
        }
        return new ResponseEntity<Object>(new StatusResponse(true, "Thành công"), HttpStatus.OK);
    }
}
