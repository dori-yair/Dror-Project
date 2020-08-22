export class CalendarEventAction {
           
    get startDate() {
        return this._startDate;
    }
    
    set startDate(value) {
        this._startDate = value;
    }

    get endDate() {
        return this._endDate;
    }
    
    set endDate(value) {
        this._endtDate = value;
    }

    get action() {
        return this._action;
      }
    
    set action(value) {
        this._action = value;
      }

    get title() {
        return this._title;
      }
    
      set title(value) {
        this._title = value;
      }
     toString(){
         let st=""
         st+= "title=" + this.title + "\n"
         st+= "action=" + this.action + "\n"
         st+= "start=" + this.startDate + "\n"
         st+= "end=" + this.endDate + "\n"
         return st;
     }       
}
 class CalendarIntent{
    get intent() {
        return this._intent;
      }
    
      set intent(value) {
        this._intent = value;
      }
       
      get startIndex() {
        return this._startIndex;
      }
    
      set startIndex(value) {
        this._startIndex = value;
      }
      get endIndex() {
        return this._endIndex;
      }
    
      set endIndex(value) {
        this._endIndex = value;
      }
}

export class timeUtils{
    static  getToday() {
        const today = new Date();
        today.setDate(today.getDate() ); // even 32 is acceptable
        return today
    }
    
    static  getTomorrow() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1); // even 32 is acceptable
        tomorrow.setHours(0,0,0,0);     
        return tomorrow
    }
    
    static getNextWeek(weekCount=1) {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + weekCount * 7 - nextWeek.getDay()); 
       nextWeek.setHours(0,0,0,0)
       return nextWeek
        // return `${nextWeek.getFullYear()}/${nextWeek.getMonth() }/${nextWeek.getDate()}`;
    }

    
    static getNextDay(dayWeekIndex, hours=0, mins=0){
        const res = new Date();
        if(res.getDay() >= dayWeekIndex)
            res.setDate(res.getDate() + 7  + dayWeekIndex -  res.getDay() - 1); 
        else
            res.setDate(res.getDate() +  dayWeekIndex -  res.getDay() - 1); 

        res.setHours(hours,mins,0,0);     
        return res

    }
    
    static getNextDayNextWeek(dayWeekIndex, hours=0, mins=0){
        const res = new Date();
        res.setDate(res.getDate() -  res.getDay() + 7  + dayWeekIndex  - 1);     
        res.setHours(hours,mins,0,0);   
        return res

    }
}


export class simpleCalendarNLP{
    
    constructor(requestText){ 
        this.requestText = requestText
        this._init()
    }     
    get timeRegexFilter() {
        return this._timeRegexFilter;
      }
    
      set timeRegexFilter(value) {
        this._timeRegexFilter = value;
      }
    
    _init(){       
        
        this._deleteTagSet = new Set(['בוטל','תמחקי','מחקי','תמחק','מחק','הסירי','בוטלה','תסירי','לא רלוונטית','לא תתקיים','מבוטל','מבוטלת','התבטלה'])
        this._changeTagSet = new Set(['יזוז','ידחה','יזוז','נדחה','זז','תזיזי','תשני', 'נדחית' , 'זזה', 'תזוז', 'תידחה' ,'נדחיתה'])
        this._addTagSet = new Set(['תקבעי', 'חדשה', 'יש', 'תהיה','יהיה','נפגשים','ניפגש' ])
        this._atTagSet = new Set(['ב','מ','ה','ל' ])
        this._locationTagSet = new Set(['אצל' ])
        this._timeTagMap = new Map();
        this._timeTagMap.set('למחר',  timeUtils.getTomorrow())
        this._timeTagMap.set('מחר',  timeUtils.getTomorrow())
        
        this._setTimeExpression(['היום'],timeUtils.getToday()) 
        this._setNextNDayPatterns('ראשון',1)     
        this._setNextNDayPatterns('שני',2)     
        this._setNextNDayPatterns('שלישי',2)     
        this._setNextNDayPatterns('רביעי',4)     
        this._setNextNDayPatterns('חמישי',2)     
        this._setNextNDayPatterns('שישי',6)     
        this._setNextNDayPatterns('שבת',7)     
        this._setTimeExpression(['שבוע הבא','בעוד שבוע','בשבוע הבא'], timeUtils.getNextWeek())
        this._timeTagMap.set('בעוד שבועיים', timeUtils.getNextWeek())

        this._timeTagMap = new Map([...this._timeTagMap].sort())
        this._mapTxtToNumber = new Map()           
        this._initMapTxtToNumber()

    }

    _setTimeExpression(pharses,date){
        pharses.forEach(phrase=> this._timeTagMap.set(phrase, date))
    }

    _setNextNDayPatterns(dayStr,dayIndex){
        if(7 == dayIndex){
            this._setTimeExpression(
                [
                    ,`ביום ${dayStr} הקרוב`
                    ,`ב${dayStr} הקרובה`
                    ,`ב${dayStr}`
                ]
                , timeUtils.getNextDay(dayIndex) )
            this._setTimeExpression(
                    [
                        ,`ביום ${dayStr} הבא`
                        ,`ב${dayStr} הבאה`
                    ]
                    , timeUtils.getNextDayNextWeek(dayIndex) )
        
        }//end shabat
        else{
            this._setTimeExpression(
                [
                    ,`ביום ${dayStr} הקרוב`
                    ,`ביום ${dayStr}`
                    ,`ב${dayStr} הקרוב`
                    ,`ב${dayStr}`
                ]
                , timeUtils.getNextDay(dayIndex) )
            this._setTimeExpression(
                [//TODO: add next week expression
                    ,`ביום ${dayStr} הבא`
                    ,`ב${dayStr} הבא`
                ]
                , timeUtils.getNextDayNextWeek(dayIndex) )
        }
        
    }
    
    _cleanTimeString(stTime){    
            return stTime.replace(/[^a-zA-Zא-ת0-9:]/g, "");
    }
        
    _isNumeric(stTime){     
        for (let index = 0; index < stTime.length; index++) {
            const c = stTime[index];
            if(isNaN(c) && c !=':' ) 
                return false 
        }    
                return true
    }
    
    _parseAsNumericDate(dateDay,stTime)   {
        dateDay.setHours( parseInt(stTime))
        return dateDay
    }

    _calcStartDate(dateDay,stTime){
        //remove special chars
        stTime = this._cleanTimeString(stTime);
        if (this._isNumeric(stTime)) { 
            return this._parseAsNumericDate(dateDay,stTime)        
        } 
        var dt = this._parseTextAsNumber(stTime)
        if(!isNaN(dt))
            return dt
        return
    }       

    _analyzeTime(txt, startIndex)
    {
        // most common - HH:mm form
        let res = txt.match(/\d*\d/g)
        if(res == null){
            return this._parseTextAsNumber(txt)
        }
        else{

            if(res.length==1){
                return [parseInt (res[0]),0]
            }
            if(res.length==2){
                return [parseInt(res[0]),parseInt(res[1])]
            }
        }
            
           //siri time expressions:
            // HH:mm
            // ב-HH:MM
            // בTEXT
       
    }

    _analyzeStartDate(txt)
    {    
        let ci = new CalendarIntent();
        //for((key,value) in _timeTagMap){
        for (const [key, value] of this._timeTagMap.entries()) {

            if(txt.includes(key)){
                ci.intent = this._timeTagMap.get(key)
                //looking for the right hour
                let result =  this._analyzeTime(txt, txt.indexOf(key) + key.length)                
                ci.intent.setHours(result[0],result[1],0,0)
                break;
            }
        }
        return ci      
    }

    
    _analyzeEndDate(txt)
    {    
        // defaullt value = 1 hour
        // search for till
        // עד HH:MM
        // עד - HH:MM  
      //  ומסתיימת ב
        // search for duration
        // 
        let ci = new CalendarIntent();
        ci.intent = 1
        
        
        let res = txt.match(/עד ה\עד\עד ש/g)
        if(res == null){
            return this._parseTextAsNumber(txt)
        }
        return ci      
    }

    _replaceAt(string,index, char) {
        var a = string.split("");
        a[index] = char;
        return a.join("");
    }

    _initMapTxtToNumber()
    {
        let stIn = "ב"
        let stInFilter = `(${stIn}*|${stIn}* *|${stIn}* *-* *|)`
        
        this._mapTxtToMinutes = new Map()
        this._mapTxtToMinutes.set('וחמישה',5)
        this._mapTxtToMinutes.set('ועשרה',10)
        this._mapTxtToMinutes.set('ורבע',15)
        this._mapTxtToMinutes.set('ועשרים',20)
        this._mapTxtToMinutes.set('וחצי',30)
        this._extensionsFilter = '(ועשרה|ועשרים|וחצי|ורבע|וחמישה)'

        this._mapTxtToNumber.set('אחת',13)
        this._mapTxtToNumber.set('שתיים',14)
        this._mapTxtToNumber.set('שלוש',15)
        this._mapTxtToNumber.set('ארבע',16)
        this._mapTxtToNumber.set('חמש',17)
        this._mapTxtToNumber.set('שש',18)
        this._mapTxtToNumber.set('שבע',19)
        this._mapTxtToNumber.set('שמונה',8)
        this._mapTxtToNumber.set('תשע',9)
        this._mapTxtToNumber.set('עשר',10)
        this._mapTxtToNumber.set('אחד',13)
        this._mapTxtToNumber.set('אחת עשרה',11)
        this._mapTxtToNumber.set('שתים עשרה',12)
        this._mapTxtToNumber.set('שלוש עשרה',13)
        this._mapTxtToNumber.set('ארבע עשרה',14) 
        
        let daysFilter = "("
        this._mapTxtToNumber.forEach( (vakue, key,map) => { daysFilter+=`${key}|` } )
        this._daysFilter = this._replaceAt(daysFilter,daysFilter.length-1,')')
//(ב-|ב)?(חמש|שש) *(ועשרה|ןחמישה)*
        this.timeRegexFilter = `${stInFilter}?${this._daysFilter} *${this._extensionsFilter}*`
    
    }
    
    _parseTextAsNumber(stTime){
        let hours = 0
        let mins = 0
        let reg = new RegExp(this.timeRegexFilter,"g")
        var startindex = stTime.search(reg)
        var res = stTime.match(reg)
        if(res == null){
            log(`no textual time was found`)
            return[hours,mins]
        }
        
        reg = new RegExp(`${this._daysFilter} *${this._extensionsFilter}*`,"g")
        let cleanResult = res[0].match(reg)
        if(null == cleanResult){
            log('textutal time parse failed')
            return[hours,mins]
        }
    
        let clean = cleanResult[0].trim().split(' ')
        if(clean.length > 0 && this._mapTxtToNumber.has(clean[0])){
            hours = this._mapTxtToNumber.get(clean[0])
        
            if(clean.length == 2 && this._mapTxtToMinutes.has(clean[1]) ){
                mins = this._mapTxtToMinutes.get(clean[1])
            }

        }
        return [hours,mins];
    }
    
    _analyzeAction(txt){
        
        let ci = new CalendarIntent();
        //search single word verb
        txt.split(' ').forEach((word, index) => {
            if (this._deleteTagSet.has(word) ){
                ci.intent = "DELETE"
                ci.startIndex = index
            }
            else
                if (this._changeTagSet.has(word) ){                   
                    ci.intent = "CHANGE"
                    ci.startIndex = index
                }       
                else if(this._addTagSet.has(word) ){
                    ci.intent = "ADD"
                    ci.startIndex = index
                }
            })
        ci.endIndex = ci.startIndex 
        return ci
        
    }

    _analyzeTitle(txt)
    {
        txt.split(' ').forEach((word) => { if( word[0]=='ה') return word})
        return txt[0]
    }

    // public functions
    analyzeRequest(){
        let cea = new CalendarEventAction()
        let actionIntent = this._analyzeAction(this.requestText)
        cea.action = actionIntent.intent
        cea.startDate = this._analyzeStartDate(this.requestText).intent
        cea.endDate = this._analyzeEndDate(this.requestText).intent        
        cea.title = this._analyzeTitle(this.requestText)
        return cea
    }

    static analyzeRequest(requestText){
        let nlp = new simpleCalendarNLP(requestText)
        return nlp.analyzeRequest()
    }
}


function log(msg){
    console.log(msg)
}