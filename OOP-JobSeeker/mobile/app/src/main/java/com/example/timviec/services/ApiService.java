package com.example.timviec.services;

import com.example.timviec.App;
import com.example.timviec.model.API;
import com.example.timviec.model.Education;
import com.example.timviec.model.Experience;
import com.example.timviec.model.Skill;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ApiService {
    Gson gson = new GsonBuilder()
            .setLenient()
            .create();

    OkHttpClient apiClient = new OkHttpClient().newBuilder()
            .addInterceptor(new ApiServiceInterceptor())
            .build();

    ApiService apiService = new Retrofit.Builder()
            .baseUrl("https://timviecnhanh.herokuapp.com/api/")
            .addConverterFactory(GsonConverterFactory.create(gson))
            .client(apiClient)
            .build()
            .create(ApiService.class);

    @POST("auth/login")
    Call<API.LoginResponse> login(@Body API.LoginBody body);

    @GET("auth/user/detail")
    Call<API.UserDetailResponse> getUserDetail();

    @POST("user/create/freelancer")
    Call<API.SignupUserResponse> createFreelancer(@Body API.CreateFreelancerBody body);

    @PUT("user/freelancer/update")
    Call<API.Response> updateFreelancer(@Body API.UpdateFreelancerBody body);

    @POST("user/create/enterprise")
    Call<API.SignupEnterpriseResponse> createEnterprise(@Body API.CreateEnterpriseBody body);

    @PUT("user/enterprise/update")
    Call<API.Response> updateEnterprise(@Body API.UpdateEnterpriseBody body);

    @PUT("user/setFcm")
    Call<API.Response> updateFCM(@Body API.UpdateFCMBody body);

    @POST("education/create")
    Call<API.Response> createEducation(@Body Education body);

    @GET("education/all")
    Call<API.getAllEducationResponse> getAllEducation();

    @PUT("education/update/{id}")
    Call<API.Response> updateEducation(@Body Education body, @Path("id") Integer id);

    @DELETE("education/delete/{id}")
    Call<API.Response> deleteEducation(@Path("id") Integer id);

    @POST("skill/create")
    Call<API.Response> createSkill(@Body Skill body);

    @GET("skill/all")
    Call<API.getAllSkillResponse> getAllSkill();

    @PUT("skill/update/{id}")
    Call<API.Response> updateSkill(@Body Skill body, @Path("id") Integer id);

    @DELETE("skill/delete/{id}")
    Call<API.Response> deleteSkill(@Path("id") Integer id);

    @POST("experience/create")
    Call<API.Response> createExperience(@Body Experience body);

    @GET("experience/all")
    Call<API.getAllExperienceResponse> getAllExperience();

    @PUT("experience/update/{id}")
    Call<API.Response> updateExperience(@Body Experience body, @Path("id") Integer id);

    @DELETE("experience/delete/{id}")
    Call<API.Response> deleteExperience(@Path("id") Integer id);

    @POST("post/create")
    Call<API.Response> createPost(@Body API.postBody body);

    @GET("post/all")
    Call<API.getAllPostResponse> getAllPost(@Query("enterprise") Boolean enterprise, @Query("pageNo") int pageNo, @Query("name") String name);

    @GET("post/{id}")
    Call<API.getPostResponse> getDetailPost(@Path("id") Integer id);

    @PUT("post/update/{id}")
    Call<API.Response> updatePost(@Path("id") Integer id, @Body API.postBody body);

    @DELETE("post/delete/{id}")
    Call<API.Response> deletePost(@Path("id") Integer id);

    @PUT("post/apply/{id}")
    Call<API.Response> applyPost(@Path("id") Integer id);

    @PUT("post/{postId}/approve/{userId}")
    Call<API.Response> approvePost(@Path("postId") Integer postId, @Path("userId") Integer userId);

    @PUT("post/{postId}/reject/{userId}")
    Call<API.Response> rejectPost(@Path("postId") Integer postId, @Path("userId") Integer userId);

    @GET("user/freelancer/getPost")
    Call<API.getAllPostResponse> getApplyPost();

    @GET("user/freelancer/{id}")
    Call<API.UserPublic> getUserPublic(@Path("id") Integer id);
}

class ApiServiceInterceptor implements Interceptor {
    @Override
    public Response intercept(Chain chain) throws IOException {
        Request.Builder builder = chain.request().newBuilder();
        String authToken = "Bearer " + App.getContext().getStateManager().getAuthToken();
        builder.header("Authorization", authToken);
        builder.addHeader("Content-Type", "application/json");
        return chain.proceed(builder.build());
    }
}




