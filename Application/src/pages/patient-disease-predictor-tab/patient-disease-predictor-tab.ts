import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, PopoverController, App } from 'ionic-angular';
import { FirebaseApp } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

import {PatientHomePage} from '../patient-home/patient-home';

import { RestProvider } from '../../providers/rest/rest';
import { UtilityProvider } from '../../providers/utility/utility';
import { NotificationsProvider } from '../../providers/notifications/notifications';

import * as constants from '../../constants';
/**
 * Generated class for the PatientDiseasePredictorTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-patient-disease-predictor-tab',
  templateUrl: 'patient-disease-predictor-tab.html',
})
export class PatientDiseasePredictorTabPage {

	predictedDisease : string = '';
  searchItem : string = '';
  symptomsList = [];
  symptomsMap = [];
  notificationsData: any = {};
  notifications: number;
  database: any;

  constructor(public alertCtrl: AlertController, private notificationsProvider: NotificationsProvider,
    private utilityProvider: UtilityProvider, public appCtrl: App,
    public firebase: FirebaseApp, 
  	private afAuth: AngularFireAuth, 
  	public navCtrl: NavController, 
  	public navParams: NavParams, public popoverCtrl: PopoverController,
  	public restProvider: RestProvider, public loadingCtrl: LoadingController ) 
  {  
    this.initializeSymptomsList();
    this.uncheckSymptoms();
    
    this.notificationsData['receiverUid'] = navParams.get('uid');
    this.notificationsData['notificationsList'] = [];
    this.database = firebase.database();
    var notificationsRef = this.database.ref(constants.DB_NOTIFICATIONS + '/' + navParams.get('uid'));
    
    notificationsRef.on('value', (snapshot)=>{
      notificationsProvider.pollNotifications(this.database, this.notificationsData);      
    });

  }


  initializeSymptomsList() {
    this.symptomsList = ["abdomen acute","abdominal bloating","abdominal tenderness","abnormal sensation","abnormally hard consistency","abortion","abscess bacterial","absences finding","achalasia","ache","adverse effect","adverse reaction","agitation","air fluid level","alcohol binge episode","alcoholic withdrawal symptoms","ambidexterity","angina pectoris","anorexia","anosmia","aphagia","apyrexial","arthralgia","ascites","asterixis","asthenia","asymptomatic","ataxia","atypia","aura","awakening early","barking cough","bedridden","behavior hyperactive","behavior showing increased motor activity","blackout","blanch","bleeding of vagina","bowel sounds decreased","bradycardia","bradykinesia","breakthrough pain","breath sounds decreased","breath-holding spell","breech presentation","bruit","burning sensation","cachexia","cardiomegaly","cardiovascular event","cardiovascular finding","catatonia","catching breath","charleyhorse","chest discomfort","chest tightness","chill","choke","cicatrisation","clammy skin","claudication","clonus","clumsiness","colic abdominal","consciousness clear","constipation","coordination abnormal","cough","cushingoid facies","cushingoid habitus","cyanosis","cystic lesion","debilitation","decompensation","decreased body weight","decreased stool caliber","decreased translucency","diarrhea","difficulty","difficulty passing urine","disequilibrium","distended abdomen","distress respiratory","disturbed family","dizziness","dizzy spells","drool","drowsiness","dullness","dysarthria","dysdiadochokinesia","dysesthesia","dyspareunia","dyspnea","dyspnea on exertion","dysuria","ecchymosis","egophony","elation","emphysematous change","energy increased","enuresis","erythema","estrogen use","excruciating pain","exhaustion","extrapyramidal sign","extreme exhaustion","facial paresis","fall","fatigability","fatigue","fear of falling","fecaluria","feces in rectum","feeling hopeless","feeling strange","feeling suicidal","fever","flare","flatulence","floppy","flushing","focal seizures","food intolerance","formication","frail","fremitus","frothy sputum","gag","gasping for breath","general discomfort","general unsteadiness","giddy mood","gravida 0","green sputum","groggy","guaiac positive","gurgle","hacking cough","haemoptysis","haemorrhage","hallucinations auditory","hallucinations visual","has religious belief","headache","heartburn","heavy feeling","heavy legs","heberden's node","hematochezia","hematocrit decreased","hematuria","heme positive","hemianopsia homonymous","hemiplegia","hemodynamically stable","hepatomegaly","hepatosplenomegaly","hirsutism","history of - blackout","hoard","hoarseness","homelessness","homicidal thoughts","hot flush","hunger","hydropneumothorax","hyperacusis","hypercapnia","hyperemesis","hyperhidrosis disorder","hyperkalemia","hypersomnia","hypersomnolence","hypertonicity","hyperventilation","hypesthesia","hypoalbuminemia","hypocalcemia result","hypokalemia","hypokinesia","hypometabolism","hyponatremia","hypoproteinemia","hypotension","hypothermia","hypotonic","hypoxemia","immobile","impaired cognition","inappropriate affect","incoherent","indifferent mood","intermenstrual heavy bleeding","intoxication","irritable mood","jugular venous distention","labored breathing","lameness","large-for-dates fetus","left atrial hypertrophy","lesion","lethargy","lightheadedness","lip smacking","loose associations","low back pain","lung nodule","macerated skin","macule","malaise","mass in breast","mass of body structure","mediastinal shift","mental status changes","metastatic lesion","milky","moan","monoclonal","monocytosis","mood depressed","moody","motor retardation","murphy's sign","muscle hypotonia","muscle twitch","myalgia","mydriasis","myoclonus","nasal discharge present","nasal flaring","nausea","nausea and vomiting","neck stiffness","neologism","nervousness","night sweat","nightmare","no known drug allergies","no status change","noisy respiration","non-productive cough","nonsmoker","numbness","numbness of hand","oliguria","orthopnea","orthostasis","out of breath","overweight","pain","pain abdominal","pain back","pain chest","pain foot","pain in lower limb","pain neck","painful swallowing","pallor","palpitation","panic","pansystolic murmur","para 1","para 2","paralyse","paraparesis","paresis","paresthesia","passed stones","patient non compliance","pericardial friction rub","phonophobia","photophobia","photopsia","pin-point pupils","pleuritic pain","pneumatouria","polydypsia","polymyalgia","polyuria","poor dentition","poor feeding","posterior rhinorrhea","posturing","presence of q wave","pressure chest","previous pregnancies 2","primigravida","prodrome","productive cough","projectile vomiting","prostate tender","prostatism","proteinemia","pruritus","pulse absent","pulsus paradoxus","pustule","qt interval prolonged","r wave feature","rale","rambling speech","rapid shallow breathing","red blotches","redness","regurgitates after swallowing","renal angle tenderness","rest pain","retch","retropulsion","rhd positive","rhonchus","rigor - temperature-associated observation","rolling of eyes","room spinning","satiety early","scar tissue","sciatica","scleral icterus","scratch marks","sedentary","seizure","sensory discomfort","shooting pain","shortness of breath","side pain","sinus rhythm","sleeplessness","sleepy","slowing of urinary stream","sneeze","sniffle","snore","snuffle","soft tissue swelling","sore to touch","spasm","speech slurred","splenomegaly","spontaneous rupture of membranes","sputum purulent","st segment depression","st segment elevation","stahli's line","stiffness","stinging sensation","stool color yellow","stridor","stuffy nose","stupor","suicidal","superimposition","sweat","sweating increased","swelling","symptom aggravating factors","syncope","systolic ejection murmur","systolic murmur","t wave inverted","tachypnea","tenesmus","terrify","thicken","throat sore","throbbing sensation quality","tinnitus","tired","titubation","todd paralysis","tonic seizures","transaminitis","transsexual","tremor","tremor resting","tumor cell invasion","unable to concentrate","unconscious state","uncoordination","underweight","unhappy","unresponsiveness","unsteady gait","unwell","urge incontinence","urgency of micturition","urinary hesitation","urinoma","verbal auditory hallucinations","verbally abusive behavior","vertigo","vision blurred","vomiting","weepiness","weight gain","welt","wheelchair bound","wheezing","withdraw","worry","yellow sputum"];
  }


  getPredictedDisease() {

    console.log(this.checkSymptomsSelected());
    
    if(!this.checkSymptomsSelected()){
      this.utilityProvider.showAlert("Error", "No symptom selected!");
      return;
    }

    let loading = this.loadingCtrl.create({
        content: 'Fetching results...',
    });

    loading.present();
    
    this.restProvider.sendSelectedSymptoms(this.symptomsMap).then((result) => {
    }, (err) => {
 //     console.log(err);
      this.restProvider.getPredictedDisease()
      .then(data => {
          var results = [];
          var r = data['name'].split(' , ');
          for(var i=0;i<r.length;i++){
             if(results.indexOf(r[i])==-1)
               results.push(r[i]);
          }
          var alertMessage = 'You might be suffering from ';
          for(var i=0;i<results.length-1;i++)
            alertMessage += this.utilityProvider.capitalizeFirstLetter(results[i]) + ' or ';
          alertMessage += this.utilityProvider.capitalizeFirstLetter(results[results.length-1]);
          this.utilityProvider.showAlert("Disease Predictor", alertMessage);
      }, (err) =>{
        console.log(err);
      })
    });
    
    loading.dismiss();
  
  }


  uncheckSymptoms(){
    console.log('uncheckSymptoms');
    this.symptomsMap = [{"name":"abdomen acute","value":false},{"name":"abdominal bloating","value":false},{"name":"abdominal tenderness","value":false},{"name":"abnormal sensation","value":false},{"name":"abnormally hard consistency","value":false},{"name":"abortion","value":false},{"name":"abscess bacterial","value":false},{"name":"absences finding","value":false},{"name":"achalasia","value":false},{"name":"ache","value":false},{"name":"adverse effect","value":false},{"name":"adverse reaction","value":false},{"name":"agitation","value":false},{"name":"air fluid level","value":false},{"name":"alcohol binge episode","value":false},{"name":"alcoholic withdrawal symptoms","value":false},{"name":"ambidexterity","value":false},{"name":"angina pectoris","value":false},{"name":"anorexia","value":false},{"name":"anosmia","value":false},{"name":"aphagia","value":false},{"name":"apyrexial","value":false},{"name":"arthralgia","value":false},{"name":"ascites","value":false},{"name":"asterixis","value":false},{"name":"asthenia","value":false},{"name":"asymptomatic","value":false},{"name":"ataxia","value":false},{"name":"atypia","value":false},{"name":"aura","value":false},{"name":"awakening early","value":false},{"name":"barking cough","value":false},{"name":"bedridden","value":false},{"name":"behavior hyperactive","value":false},{"name":"behavior showing increased motor activity","value":false},{"name":"blackout","value":false},{"name":"blanch","value":false},{"name":"bleeding of vagina","value":false},{"name":"bowel sounds decreased","value":false},{"name":"bradycardia","value":false},{"name":"bradykinesia","value":false},{"name":"breakthrough pain","value":false},{"name":"breath sounds decreased","value":false},{"name":"breath-holding spell","value":false},{"name":"breech presentation","value":false},{"name":"bruit","value":false},{"name":"burning sensation","value":false},{"name":"cachexia","value":false},{"name":"cardiomegaly","value":false},{"name":"cardiovascular event","value":false},{"name":"cardiovascular finding","value":false},{"name":"catatonia","value":false},{"name":"catching breath","value":false},{"name":"charleyhorse","value":false},{"name":"chest discomfort","value":false},{"name":"chest tightness","value":false},{"name":"chill","value":false},{"name":"choke","value":false},{"name":"cicatrisation","value":false},{"name":"clammy skin","value":false},{"name":"claudication","value":false},{"name":"clonus","value":false},{"name":"clumsiness","value":false},{"name":"colic abdominal","value":false},{"name":"consciousness clear","value":false},{"name":"constipation","value":false},{"name":"coordination abnormal","value":false},{"name":"cough","value":false},{"name":"cushingoid facies","value":false},{"name":"cushingoid habitus","value":false},{"name":"cyanosis","value":false},{"name":"cystic lesion","value":false},{"name":"debilitation","value":false},{"name":"decompensation","value":false},{"name":"decreased body weight","value":false},{"name":"decreased stool caliber","value":false},{"name":"decreased translucency","value":false},{"name":"diarrhea","value":false},{"name":"difficulty","value":false},{"name":"difficulty passing urine","value":false},{"name":"disequilibrium","value":false},{"name":"distended abdomen","value":false},{"name":"distress respiratory","value":false},{"name":"disturbed family","value":false},{"name":"dizziness","value":false},{"name":"dizzy spells","value":false},{"name":"drool","value":false},{"name":"drowsiness","value":false},{"name":"dullness","value":false},{"name":"dysarthria","value":false},{"name":"dysdiadochokinesia","value":false},{"name":"dysesthesia","value":false},{"name":"dyspareunia","value":false},{"name":"dyspnea","value":false},{"name":"dyspnea on exertion","value":false},{"name":"dysuria","value":false},{"name":"ecchymosis","value":false},{"name":"egophony","value":false},{"name":"elation","value":false},{"name":"emphysematous change","value":false},{"name":"energy increased","value":false},{"name":"enuresis","value":false},{"name":"erythema","value":false},{"name":"estrogen use","value":false},{"name":"excruciating pain","value":false},{"name":"exhaustion","value":false},{"name":"extrapyramidal sign","value":false},{"name":"extreme exhaustion","value":false},{"name":"facial paresis","value":false},{"name":"fall","value":false},{"name":"fatigability","value":false},{"name":"fatigue","value":false},{"name":"fear of falling","value":false},{"name":"fecaluria","value":false},{"name":"feces in rectum","value":false},{"name":"feeling hopeless","value":false},{"name":"feeling strange","value":false},{"name":"feeling suicidal","value":false},{"name":"fever","value":false},{"name":"flare","value":false},{"name":"flatulence","value":false},{"name":"floppy","value":false},{"name":"flushing","value":false},{"name":"focal seizures","value":false},{"name":"food intolerance","value":false},{"name":"formication","value":false},{"name":"frail","value":false},{"name":"fremitus","value":false},{"name":"frothy sputum","value":false},{"name":"gag","value":false},{"name":"gasping for breath","value":false},{"name":"general discomfort","value":false},{"name":"general unsteadiness","value":false},{"name":"giddy mood","value":false},{"name":"gravida 0","value":false},{"name":"green sputum","value":false},{"name":"groggy","value":false},{"name":"guaiac positive","value":false},{"name":"gurgle","value":false},{"name":"hacking cough","value":false},{"name":"haemoptysis","value":false},{"name":"haemorrhage","value":false},{"name":"hallucinations auditory","value":false},{"name":"hallucinations visual","value":false},{"name":"has religious belief","value":false},{"name":"headache","value":false},{"name":"heartburn","value":false},{"name":"heavy feeling","value":false},{"name":"heavy legs","value":false},{"name":"heberden's node","value":false},{"name":"hematochezia","value":false},{"name":"hematocrit decreased","value":false},{"name":"hematuria","value":false},{"name":"heme positive","value":false},{"name":"hemianopsia homonymous","value":false},{"name":"hemiplegia","value":false},{"name":"hemodynamically stable","value":false},{"name":"hepatomegaly","value":false},{"name":"hepatosplenomegaly","value":false},{"name":"hirsutism","value":false},{"name":"history of - blackout","value":false},{"name":"hoard","value":false},{"name":"hoarseness","value":false},{"name":"homelessness","value":false},{"name":"homicidal thoughts","value":false},{"name":"hot flush","value":false},{"name":"hunger","value":false},{"name":"hydropneumothorax","value":false},{"name":"hyperacusis","value":false},{"name":"hypercapnia","value":false},{"name":"hyperemesis","value":false},{"name":"hyperhidrosis disorder","value":false},{"name":"hyperkalemia","value":false},{"name":"hypersomnia","value":false},{"name":"hypersomnolence","value":false},{"name":"hypertonicity","value":false},{"name":"hyperventilation","value":false},{"name":"hypesthesia","value":false},{"name":"hypoalbuminemia","value":false},{"name":"hypocalcemia result","value":false},{"name":"hypokalemia","value":false},{"name":"hypokinesia","value":false},{"name":"hypometabolism","value":false},{"name":"hyponatremia","value":false},{"name":"hypoproteinemia","value":false},{"name":"hypotension","value":false},{"name":"hypothermia","value":false},{"name":"hypotonic","value":false},{"name":"hypoxemia","value":false},{"name":"immobile","value":false},{"name":"impaired cognition","value":false},{"name":"inappropriate affect","value":false},{"name":"incoherent","value":false},{"name":"indifferent mood","value":false},{"name":"intermenstrual heavy bleeding","value":false},{"name":"intoxication","value":false},{"name":"irritable mood","value":false},{"name":"jugular venous distention","value":false},{"name":"labored breathing","value":false},{"name":"lameness","value":false},{"name":"large-for-dates fetus","value":false},{"name":"left atrial hypertrophy","value":false},{"name":"lesion","value":false},{"name":"lethargy","value":false},{"name":"lightheadedness","value":false},{"name":"lip smacking","value":false},{"name":"loose associations","value":false},{"name":"low back pain","value":false},{"name":"lung nodule","value":false},{"name":"macerated skin","value":false},{"name":"macule","value":false},{"name":"malaise","value":false},{"name":"mass in breast","value":false},{"name":"mass of body structure","value":false},{"name":"mediastinal shift","value":false},{"name":"mental status changes","value":false},{"name":"metastatic lesion","value":false},{"name":"milky","value":false},{"name":"moan","value":false},{"name":"monoclonal","value":false},{"name":"monocytosis","value":false},{"name":"mood depressed","value":false},{"name":"moody","value":false},{"name":"motor retardation","value":false},{"name":"murphy's sign","value":false},{"name":"muscle hypotonia","value":false},{"name":"muscle twitch","value":false},{"name":"myalgia","value":false},{"name":"mydriasis","value":false},{"name":"myoclonus","value":false},{"name":"nasal discharge present","value":false},{"name":"nasal flaring","value":false},{"name":"nausea","value":false},{"name":"nausea and vomiting","value":false},{"name":"neck stiffness","value":false},{"name":"neologism","value":false},{"name":"nervousness","value":false},{"name":"night sweat","value":false},{"name":"nightmare","value":false},{"name":"no known drug allergies","value":false},{"name":"no status change","value":false},{"name":"noisy respiration","value":false},{"name":"non-productive cough","value":false},{"name":"nonsmoker","value":false},{"name":"numbness","value":false},{"name":"numbness of hand","value":false},{"name":"oliguria","value":false},{"name":"orthopnea","value":false},{"name":"orthostasis","value":false},{"name":"out of breath","value":false},{"name":"overweight","value":false},{"name":"pain","value":false},{"name":"pain abdominal","value":false},{"name":"pain back","value":false},{"name":"pain chest","value":false},{"name":"pain foot","value":false},{"name":"pain in lower limb","value":false},{"name":"pain neck","value":false},{"name":"painful swallowing","value":false},{"name":"pallor","value":false},{"name":"palpitation","value":false},{"name":"panic","value":false},{"name":"pansystolic murmur","value":false},{"name":"para 1","value":false},{"name":"para 2","value":false},{"name":"paralyse","value":false},{"name":"paraparesis","value":false},{"name":"paresis","value":false},{"name":"paresthesia","value":false},{"name":"passed stones","value":false},{"name":"patient non compliance","value":false},{"name":"pericardial friction rub","value":false},{"name":"phonophobia","value":false},{"name":"photophobia","value":false},{"name":"photopsia","value":false},{"name":"pin-point pupils","value":false},{"name":"pleuritic pain","value":false},{"name":"pneumatouria","value":false},{"name":"polydypsia","value":false},{"name":"polymyalgia","value":false},{"name":"polyuria","value":false},{"name":"poor dentition","value":false},{"name":"poor feeding","value":false},{"name":"posterior rhinorrhea","value":false},{"name":"posturing","value":false},{"name":"presence of q wave","value":false},{"name":"pressure chest","value":false},{"name":"previous pregnancies 2","value":false},{"name":"primigravida","value":false},{"name":"prodrome","value":false},{"name":"productive cough","value":false},{"name":"projectile vomiting","value":false},{"name":"prostate tender","value":false},{"name":"prostatism","value":false},{"name":"proteinemia","value":false},{"name":"pruritus","value":false},{"name":"pulse absent","value":false},{"name":"pulsus paradoxus","value":false},{"name":"pustule","value":false},{"name":"qt interval prolonged","value":false},{"name":"r wave feature","value":false},{"name":"rale","value":false},{"name":"rambling speech","value":false},{"name":"rapid shallow breathing","value":false},{"name":"red blotches","value":false},{"name":"redness","value":false},{"name":"regurgitates after swallowing","value":false},{"name":"renal angle tenderness","value":false},{"name":"rest pain","value":false},{"name":"retch","value":false},{"name":"retropulsion","value":false},{"name":"rhd positive","value":false},{"name":"rhonchus","value":false},{"name":"rigor - temperature-associated observation","value":false},{"name":"rolling of eyes","value":false},{"name":"room spinning","value":false},{"name":"satiety early","value":false},{"name":"scar tissue","value":false},{"name":"sciatica","value":false},{"name":"scleral icterus","value":false},{"name":"scratch marks","value":false},{"name":"sedentary","value":false},{"name":"seizure","value":false},{"name":"sensory discomfort","value":false},{"name":"shooting pain","value":false},{"name":"shortness of breath","value":false},{"name":"side pain","value":false},{"name":"sinus rhythm","value":false},{"name":"sleeplessness","value":false},{"name":"sleepy","value":false},{"name":"slowing of urinary stream","value":false},{"name":"sneeze","value":false},{"name":"sniffle","value":false},{"name":"snore","value":false},{"name":"snuffle","value":false},{"name":"soft tissue swelling","value":false},{"name":"sore to touch","value":false},{"name":"spasm","value":false},{"name":"speech slurred","value":false},{"name":"splenomegaly","value":false},{"name":"spontaneous rupture of membranes","value":false},{"name":"sputum purulent","value":false},{"name":"st segment depression","value":false},{"name":"st segment elevation","value":false},{"name":"stahli's line","value":false},{"name":"stiffness","value":false},{"name":"stinging sensation","value":false},{"name":"stool color yellow","value":false},{"name":"stridor","value":false},{"name":"stuffy nose","value":false},{"name":"stupor","value":false},{"name":"suicidal","value":false},{"name":"superimposition","value":false},{"name":"sweat","value":false},{"name":"sweating increased","value":false},{"name":"swelling","value":false},{"name":"symptom aggravating factors","value":false},{"name":"syncope","value":false},{"name":"systolic ejection murmur","value":false},{"name":"systolic murmur","value":false},{"name":"t wave inverted","value":false},{"name":"tachypnea","value":false},{"name":"tenesmus","value":false},{"name":"terrify","value":false},{"name":"thicken","value":false},{"name":"throat sore","value":false},{"name":"throbbing sensation quality","value":false},{"name":"tinnitus","value":false},{"name":"tired","value":false},{"name":"titubation","value":false},{"name":"todd paralysis","value":false},{"name":"tonic seizures","value":false},{"name":"transaminitis","value":false},{"name":"transsexual","value":false},{"name":"tremor","value":false},{"name":"tremor resting","value":false},{"name":"tumor cell invasion","value":false},{"name":"unable to concentrate","value":false},{"name":"unconscious state","value":false},{"name":"uncoordination","value":false},{"name":"underweight","value":false},{"name":"unhappy","value":false},{"name":"unresponsiveness","value":false},{"name":"unsteady gait","value":false},{"name":"unwell","value":false},{"name":"urge incontinence","value":false},{"name":"urgency of micturition","value":false},{"name":"urinary hesitation","value":false},{"name":"urinoma","value":false},{"name":"verbal auditory hallucinations","value":false},{"name":"verbally abusive behavior","value":false},{"name":"vertigo","value":false},{"name":"vision blurred","value":false},{"name":"vomiting","value":false},{"name":"weepiness","value":false},{"name":"weight gain","value":false},{"name":"welt","value":false},{"name":"wheelchair bound","value":false},{"name":"wheezing","value":false},{"name":"withdraw","value":false},{"name":"worry","value":false},{"name":"yellow sputum","value":false}];    
  }


  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeSymptomsList();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.symptomsList = this.symptomsList.filter((symptom) => {
        return (symptom.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }


  checkSymptomsSelected() {
    for(var i=0;i<this.symptomsMap.length;i++){
      if(this.symptomsMap[i].value == true)
        return true;
    }
    return false;
  }


  updateSymptomsMap(symptomIndex: number, event){
    this.symptomsMap[symptomIndex].value = event.value;
    // console.log(this.symptomsMap);
  }


  symptomChecked(symptomIndex: number){
    return this.symptomsMap[symptomIndex].value;
  }


  presentNotifications(event){
    this.notificationsProvider.presentNotifications(event, this.popoverCtrl, this.notificationsData);
  }


  logoutUser(){
    this.utilityProvider.logoutUser(this.afAuth, this.appCtrl, PatientHomePage);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientDiseasePredictorTabPage');
  }

}