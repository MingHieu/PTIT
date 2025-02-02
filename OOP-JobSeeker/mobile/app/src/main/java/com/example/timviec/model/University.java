package com.example.timviec.model;

public class University {
    private int id;
    private String name, shortName, code;
    /**
     * String || List of String
     */
    private Object address;

    public University() {
    }

    public University(int id, String name, String shortName, String code, Object address) {
        this.id = id;
        this.name = name;
        this.shortName = shortName;
        this.code = code;
        this.address = address;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Object getAddress() {
        return address;
    }

    public void setAddress(Object address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "University{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", shortName='" + shortName + '\'' +
                ", code='" + code + '\'' +
                ", address=" + address +
                '}';
    }
}
