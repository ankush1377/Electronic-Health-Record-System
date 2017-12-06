package com.pec.resource;

import com.codahale.metrics.annotation.Timed;
import com.pec.impl.DiseasePredictor;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Path("/app")
@Produces(MediaType.APPLICATION_JSON)
public class ApplicationResource {

    DiseasePredictor diseasePredictor;
    List<Map<String,String>> diseaseList;

    @GET
    @Timed
    @Path("/getPredictedDisease")
    public String getDiseaseName(){
        System.out.println("getDiseaseName");
        diseasePredictor = new DiseasePredictor(diseaseList);
        String diseaseJSON =  "{\"name\": \"" + diseasePredictor.getPredictionResult() + "\"}";
        return diseaseJSON;
    }


    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setDiseaseList(List<Map<String,String>> diseaseList) throws URISyntaxException {
        System.out.println("setDiseaseList");
        this.diseaseList = diseaseList;
        return Response.ok().build();
    }

}
