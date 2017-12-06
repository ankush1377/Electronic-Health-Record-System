# Electronic-Health-Record-System

1.Install Node.js from https://nodejs.org/en/
2.Install ionic 3 using command 'npm install -g cordova ionic'
3.Download R from https://cran.r-project.org/bin/windows/base/
4.Setup Disease Predictor module in any JAVA IDE.
5.In file DiseasePredictor in Disease Predictor module, edit line ProcessBuilder pb = new ProcessBuilder("Absolute path of Rscript.exe in C drive","Absolute path of script.R in resources/R directory");
6.Make changes in script.R (setwd & test) to set their path to resources/R directory.
7.Run MainApplication.java.
8.Go to Application directory->open terminal->run command 'ionic serve --lab'
