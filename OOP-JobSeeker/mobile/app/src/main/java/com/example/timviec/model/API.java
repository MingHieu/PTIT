package com.example.timviec.model;

import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;

public class API {
    public static class LoginBody {
        private String username, password;

        public LoginBody(String username, String password) {
            this.username = username;
            this.password = password;
        }
    }

    public static class LoginResponse {
        private int id, role;
        private String email, token;
        private User.UserDetail detail;

        public int getRole() {
            return role;
        }

        public String getToken() {
            return token;
        }

        public User.UserDetail getDetail() {
            return detail;
        }
    }

    public static class CreateFreelancerBody {
        private String name;
        private String email;
        private String password;
        private String fcmToken;

        public CreateFreelancerBody(String name, String email, String password, String fcmToken) {
            this.name = name;
            this.email = email;
            this.password = password;
            this.fcmToken = fcmToken;
        }
    }

    public static class SignupUserResponse {
        private int ID;
        private int role;
        private String email;
        private String token;
        private User.UserDetail detail;

        public int getRole() {
            return role;
        }

        public String getEmail() {
            return email;
        }

        public String getToken() {
            return token;
        }
    }

    public static class CreateEnterpriseBody {
        private String name;
        private String email;
        private String password;
        private String address;
        private String fcmToken;

        public CreateEnterpriseBody(String name, String email, String password, String address, String fcmToken) {
            this.name = name;
            this.email = email;
            this.password = password;
            this.address = address;
            this.fcmToken = fcmToken;
        }
    }

    public static class SignupEnterpriseResponse {
        private int ID;
        private int role;
        private String email;
        private String token;
        private User.UserDetail detail;

        public int getRole() {
            return role;
        }

        public String getEmail() {
            return email;
        }

        public String getToken() {
            return token;
        }
    }

    public static class UserDetailResponse {

        private Boolean status;
        private String message;
        private UserDetailResponseData data;

        public UserDetailResponseData getData() {
            return data;
        }

        public static class UserDetailResponseData {
            private int role;
            private User.UserDetail detail;

            public int getRole() {
                return role;
            }

            public User.UserDetail getDetail() {
                return detail;
            }
        }
    }

    public static class UserPublic {
        private Boolean status;
        private String message;
        private User.UserDetail data;

        public User.UserDetail getData() {
            return data;
        }
    }

    public static class UpdateFreelancerBody {
        private String avatar, name, dob, address, phone_number, introduction;
        private int gender;

        public UpdateFreelancerBody(String avatar, String name, String dob, String address, String phone_number, String introduction, int gender) {
            this.avatar = avatar;
            this.name = name;
            this.dob = dob;
            this.address = address;
            this.phone_number = phone_number;
            this.introduction = introduction;
            this.gender = gender;
        }
    }

    public static class UpdateEnterpriseBody {
        private String avatar, name, address, phone_number, introduction;

        public UpdateEnterpriseBody(String avatar, String name, String address, String phone_number, String introduction) {
            this.avatar = avatar;
            this.name = name;
            this.address = address;
            this.phone_number = phone_number;
            this.introduction = introduction;
        }
    }

    public static class UpdateFCMBody {
        @SerializedName("fcmToken")
        private String fcm;

        public UpdateFCMBody(String fcm) {
            this.fcm = fcm;
        }
    }

    public static class Response {
        private Boolean status;
        private String message;

        public String getMessage() {
            return message;
        }
    }

    public static class getAllEducationResponse {
        private Boolean status;
        private String message;
        private ArrayList<Education> data;

        public ArrayList<Education> getData() {
            return data;
        }
    }

    public static class getAllSkillResponse {
        private Boolean status;
        private String message;
        private ArrayList<Skill> data;

        public ArrayList<Skill> getData() {
            return data;
        }
    }

    public static class getAllExperienceResponse {
        private Boolean status;
        private String message;
        private ArrayList<Experience> data;

        public ArrayList<Experience> getData() {
            return data;
        }
    }

    public static class postBody {
        private Integer id;
        private String name, salary, type, experience,
                position, address, description, requirement, benefit, expired;
        private int quantity;
        private Integer gender;

        public postBody(Integer id, String name, String salary, String type, String experience, String position, String address, String description, String requirement, String benefit, String expired, int quantity, Integer gender) {
            this.id = id;
            this.name = name;
            this.salary = salary;
            this.type = type;
            this.experience = experience;
            this.position = position;
            this.address = address;
            this.description = description;
            this.requirement = requirement;
            this.benefit = benefit;
            this.expired = expired;
            this.quantity = quantity;
            this.gender = gender;
        }
    }

    public static class getAllPostResponse {
        private Boolean status;
        private String message;
        private ArrayList<Job> data;
        @SerializedName("page_number")
        private int pageNumber;
        @SerializedName("page_size")
        private int pageSize;
        @SerializedName("total_record_count")
        private int totalRecordCount;

        public ArrayList<Job> getData() {
            return data;
        }

        public int getTotalRecordCount() {
            return totalRecordCount;
        }
    }

    public static class getPostResponse {
        private Boolean status;
        private String message;
        private Data data;

        public Data getData() {
            return data;
        }

        public static class Data {
            @SerializedName("detail")
            private Job job;
            private User.UserDetail enterprise;
            private ArrayList<Applicant> applicants;
            @SerializedName("related_post")
            private ArrayList<Job> relatedJob;

            public Job getJob() {
                return job;
            }

            public User.UserDetail getEnterprise() {
                return enterprise;
            }

            public ArrayList<Job> getRelatedJob() {
                return relatedJob;
            }

            public ArrayList<Applicant> getApplicants() {
                return applicants;
            }

            public static class Applicant {
                @SerializedName("applicant")
                private User.UserDetail detail;
                // 0: pending, 1: approved, 2: rejected
                private int status;

                public User.UserDetail getDetail() {
                    return detail;
                }

                public int getStatus() {
                    return status;
                }
            }
        }
    }
}
