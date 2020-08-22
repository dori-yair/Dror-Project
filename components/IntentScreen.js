import React, { Component,useState } from 'react';
import {Modal, StyleSheet, Text, View, TextInput,SectionList, Button,Pressable,TouchableHighlight } from 'react-native';
import * as Calendar from 'expo-calendar';
import {timeUtils, simpleCalendarNLP} from './simpleCalendarNLP'
import moment from 'moment';


const TIME_FORMAT = "DD-MM-YY HH:mm"

class IntentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {   
      intentMessage:'הבריכה מחר בעשר מבוטלת',
      result:'',
      action:'',
      eventfilter:'',
      calendarEvents:[],
      calendarIds:[],
      modalVisible:false,
    };
    
  }
  
  componentDidMount() {  
    Calendar.requestCalendarPermissionsAsync().then(status => console.log({status}) )
    Calendar.requestRemindersPermissionsAsync().then(status => console.log({status}))
    Calendar.getCalendarsAsync().then(calendars => this.setState({calendarIds: calendars.map( (calendar,index,arr) =>  calendar.id )})  )
  }

  OnSubmit(){
   // var a = new simpleCalendarNLP()
   var res = simpleCalendarNLP.analyzeRequest(this.state.intentMessage  )
   this.setState( {result:res.toString(),action:res.action })  
   //find real calendar event
   if(res.action==="CHANGE" || res.action==="DELETE"){
    var endDate = Date()
    if(res.startDate.getHours()>0) 
      endDate  = moment(res.startDate).add(4, 'hours').toDate()
    else
      endDate  = moment(res.startDate).add(23, 'hours').toDate()
    
     this.setState({eventfilter :'start: ' + res.startDate + ' end : ' + endDate})
     Calendar.getEventsAsync(this.state.calendarIds,res.startDate, endDate ).then(events => this.setState({calendarEvents: events}) ).then(this.handleEvents())
    }
  }

   
  handleEvents(){
    //if(this.state.action==="ADD")
      
  //   var msg="notice\r\n"
//     if(this.state.action=="DELETE" && this.state.calendarEvents.length==1){
    //       msg = `האם תרצה להסיר את  אירוע ${this.state.calendarEvents[0].title} ${moment(this.state.calendarEvents[0].startDate).format("DD/MM HH:mm")} שיתקיים ב  `
     //     alert(msg)
         // this.props.navigation.navigate("מחק אירוע")
      //}
          //this.props.navigation.navigate("מחק אירוע",{ eventIds: this.state.calendarEvents.map( event => event.id)})
     
        
   }
   //1. by date and timeש\
  
  getCalendarEventList(){
    var events = []
    var grouped = this.groupBy(this.state.calendarEvents, event=> moment(event.startDate).format("DD-MM-YY") )
    grouped.forEach(( value,key) => {events.push(
      {
        title:key, 
        data: value.map( (item) => item)
      }
    )})
      return events 
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
  }

  ItemSeparator = () => {
  return (
    //Item Separator
    <View style={{height: 0.5, width: '100%', backgroundColor: '#C8C8C8'}}/>
  );
  }

  deleteEvent(eventToDelete){
     Calendar.deleteEventAsync(eventToDelete.id).then(console.log('event was deleted'))
  }
  updateEvent(eventToUpdate){
     this.props.navigation.navigate('הוסף אירוע',{calendarId:eventToUpdate.calendarId,
      startDate:eventToUpdate.startDate,
      endDate:eventToUpdate.endDate,
      id:eventToUpdate.id,
      title:eventToUpdate.title})
     
    }

  addNewEvent(){
    this.props.navigation.navigate('הוסף אירוע')
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="הכנס בלתמ"  
          multiline = {false}
          numberOfLines={5}
          style={styles.inputText}
          onChangeText={ (text)=> this.setState({intentMessage:text})}
        />
        <Button
          title={'analyze'}
          style={styles.input}
          onPress ={()=> this.OnSubmit()}
        />
        { this.state.action === 'ADD' 
          ? this.addNewEvent()
          : null
        }
        { this.state.action === 'DELETE' && this.state.calendarEvents.length>0 ?
          <View>
            <Text style={styles.item}>איזה אירוע לבטל?</Text>
          <View style={styles.eventsContainer} > 
          
          <SectionList
            sections={this.getCalendarEventList()}
            renderItem={({item}) =>     
             <View>
                <Text style={styles.item} onPress={this.deleteEvent.bind(this, item)}  >{item.title}</Text><Text style={styles.item}>{moment( item.startDate).format("HH:mm")}-{moment( item.endtDate).format("HH:mm")}</Text>       
             </View>
            }
            renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
            keyExtractor={(item, index) => index}
            ItemSeparatorComponent={this.ItemSeparator}
            item
          />
          <View style={{height: 1, width: '100%', backgroundColor: '#C8C8C8',margin:0,padding:0}}/>
          <Button title='אל תבטל כלום' />
        </View>
        </View>
        :null}
{ this.state.action === 'CHANGE' ?
          <View>
            <Text style={styles.item}>איזה אירוע לעדכן??</Text>
          <View style={styles.eventsContainer} > 
          
          <SectionList
            sections={this.getCalendarEventList()}
            renderItem={({item}) =>     
             <View>
                <Text style={styles.item} onPress={this.updateEvent.bind(this, item)}  >{item.title}</Text><Text style={styles.item}>{moment( item.startDate).format("HH:mm")}-{moment( item.endtDate).format("HH:mm")}</Text>       
             </View>
            }
            renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
            keyExtractor={(item, index) => index}
            ItemSeparatorComponent={this.ItemSeparator}
            item
          />
          <View style={{height: 1, width: '100%', backgroundColor: '#C8C8C8',margin:0,padding:0}}/>
          <Button title='אל תעדכן כלום' />
        </View>
        </View>
        :null}

      </View>
    );
  }
}



const styles = StyleSheet.create({
 eventsContainer:{
  borderWidth:1, 
  borderRadius:20,
  padding:10,
  margin:10
 },
  sectionHeader: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgb(220,220,200)',
    textAlign:"right"
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    textAlign:"right"
  },
  text:{
    padding: 10,
    textAlign:'right',
    //borderWidth: 1,
    borderBottomColor : 'skyblue',
    borderTopColor:'transparent',
    borderRightColor:'transparent',
    borderLeftColor:'transparent',
    margin: 20,
   

  },
  inputText: {
    padding: 10,
    textAlign:'right',
    borderWidth: 1,
    borderColor: 'skyblue',
    borderTopColor:'transparent',
    borderRightColor:'transparent',
    borderLeftColor:'transparent',
    margin: 20,
    width:'90%',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "blue",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }

});





const ModalConfirm = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <TouchableHighlight
        style={styles.openButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </TouchableHighlight>
    </View>
  );
};










export default IntentScreen;