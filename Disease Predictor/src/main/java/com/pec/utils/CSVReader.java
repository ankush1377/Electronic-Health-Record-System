package com.pec.utils;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class CSVReader {

    public static List<String> csvRowToList(String csvFilePath){
        List<String> list = new ArrayList<>();
        String line = "";
        String cvsSplitBy = ",";

        try (BufferedReader br = new BufferedReader(new FileReader(csvFilePath))) {
            while ((line = br.readLine()) != null) {
                String[] record = line.split(cvsSplitBy);
                for(String r:record)
                    list.add(r);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return list;
    }
}
