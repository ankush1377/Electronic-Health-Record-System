package com.pec;

import com.pec.resource.ApplicationResource;
import io.dropwizard.Application;
import io.dropwizard.setup.Environment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MainApplication extends Application<ApplicationConfiguration> {

    private static final Logger LOG = LoggerFactory.getLogger(MainApplication.class);

    public static void main(String[] args) throws Exception {
        new MainApplication().run(args);
    }

    @Override
    public void run(final ApplicationConfiguration configuration, final Environment environment) throws Exception {
        final ApplicationResource resource = new ApplicationResource();
        environment.jersey().register(resource);
    }
}
