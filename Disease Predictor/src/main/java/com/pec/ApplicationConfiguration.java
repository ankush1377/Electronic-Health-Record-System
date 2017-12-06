package com.pec;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.dropwizard.Configuration;
import org.hibernate.validator.constraints.NotEmpty;


public class ApplicationConfiguration extends Configuration {
    @NotEmpty
    @JsonProperty
    private String sample;

    public String getSample() {
        return sample;
    }
    
    public void setSample(final String sample) {
        this.sample = sample;
    }
}
