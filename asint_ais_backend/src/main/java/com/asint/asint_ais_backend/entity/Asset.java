package com.asint.asint_ais_backend.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Exercises lombok and spring-boot-starter-validation through annotations.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Asset {

    private String id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 50)
    private String type;

    @Size(max = 30)
    private String status;
}
