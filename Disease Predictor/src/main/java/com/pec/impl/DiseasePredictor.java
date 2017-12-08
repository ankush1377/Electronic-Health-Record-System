package com.pec.impl;

import com.pec.utils.CSVUtils;

import java.io.BufferedReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

public class DiseasePredictor {

    private String predictionResult;

    public DiseasePredictor(List<Map<String,String>> diseaseList) {
        System.out.println("DiseasePredictor");

        //write input file
        String outputFile = "src/resources/R/test.csv";
        FileWriter writer = null;
        try {
            writer = new FileWriter(outputFile);
            List<String> csvRow = new ArrayList<String>();
            for(Map<String,String> symptom : diseaseList){
                csvRow.add(symptom.get("name"));
            }
            CSVUtils.writeLine(writer, csvRow);
            csvRow.clear();
            for(Map<String,String> symptom : diseaseList){
                if(symptom.get("value").equals("true"))
                    csvRow.add(String.valueOf(1));
                else
                    csvRow.add(String.valueOf(0));
            }
            CSVUtils.writeLine(writer, csvRow);
            csvRow.clear();
            for(Map<String,String> symptom : diseaseList){
                if(symptom.get("value").equals("true"))
                    csvRow.add(String.valueOf(0.75));
                else
                    csvRow.add(String.valueOf(0));
            }
            CSVUtils.writeLine(writer, csvRow);
            csvRow.clear();
            for(Map<String,String> symptom : diseaseList){
                if(symptom.get("value").equals("true"))
                    csvRow.add(String.valueOf(0.5));
                else
                    csvRow.add(String.valueOf(0));
            }
            CSVUtils.writeLine(writer, csvRow);
            csvRow.clear();

            writer.flush();
            writer.close();
        } catch (IOException e1) {
            e1.printStackTrace();
        }


        try {
            //run script
            ProcessBuilder pb = new ProcessBuilder("C:\\Program Files\\R\\R-3.2.4revised\\bin\\Rscript.exe","E:\\@nKu$h\\Projects\\Electronic-Health-Record-System\\Disease Predictor\\src\\resources\\R\\script.R");
            Process p = pb.start();
            BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));

            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
                setPredictionResult(line);
            }
        } catch (IOException e) {
            System.out.println("Error executing script");
            e.printStackTrace();
        }
    }

    public String getPredictionResult() {
        return predictionResult;
    }

    public void setPredictionResult(String predictionResult) {
        this.predictionResult = predictionResult;
    }

}
