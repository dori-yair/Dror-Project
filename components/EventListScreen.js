import React, { Component,useState } from 'react';
import { StyleSheet, SectionList, Text, View, TextInput, Button,TouchableHighlight, Pressable } from 'react-native';
import * as Calendar from 'expo-calendar';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';

const TIME_FORMAT = "DD-MM-YY HH:mm"

class EventListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    
      calendarId: '',
      calendars:[],
      calendarEvents:[]
    };
    
  }
  
  componentDidMount() {  
    Calendar.requestCalendarPermissionsAsync().then(status => console.log({status}) )
    //Calendar.requestPermissionsAsync( ).then(status => console.log({status}) )
    Calendar.requestRemindersPermissionsAsync().then(status => console.log({status}))
    

    Calendar.getCalendarsAsync().then(cals =>  
      this.setState({ calendars: cals  }))

      var date = new Date();
      Calendar.getEventsAsync(['0','1','2','3','4','5'], date , new Date(date.getFullYear(),date.getMonth()+1,date.getDay(),0,0,0,0)).then(events =>
        this.setState({calendarEvents: events}) 
      )
 //   Calendar.getCalendarsAsync().then(onfull
      
   //   cals => 
   //   {
     // this.setState({ calendars: cals  })
   //   var startDate = new Date();
   //   var endDate =  new Date(date.getFullYear(),date.getMonth()+1,date.getDay(),0,0,0,0)
   //   Calendar.getEventsAsync(cals.map(cal,index,arr=> cal.id), startDate ,endDate).then(events => this.setState({calendarEvents: events}) 
   //   }
   //   )
    
    //Calendar.getEventsAsync(['0','1','2','3','4','5'], date , new Date(date.getFullYear(),date.getMonth()+1,date.getDay(),0,0,0,0)).then(events =>
      //  this.setState({calendarEvents: events}) 
     // )
    
    }
  
  
  getCalendarList(){
    return  this.state.calendars.map( (calendar,index) => ( {label: calendar.title, value: calendar.id}))
  }
  
  getCalendarEventList(){
    var events = []
    var grouped = this.groupBy(this.state.calendarEvents, event=> moment(event.startDate).format("DD-MM-YY") )
    grouped.forEach(( value,key) => {events.push(
      {
        title:key, 
       // day: moment(value.startDate).format("DD-MM"),
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

onEndReached(){
  var date = new Date()
  Calendar.getEventsAsync(['0','1','2','3','4','5'], date , new Date(date.getFullYear(),date.getMonth()+3,date.getDay(),0,0,0,0)).then(events =>this.setState({calendarEvents: events}))
}

ItemSeparator = () => {
  return (
    //Item Separator
    <View style={{height: 0.5, width: '100%', backgroundColor: '#C8C8C8'}}/>
  );
}
eventPressed(event){
  alert(event.title)
}
  render() {
    return (
      <View >
        <SectionList
          sections={this.getCalendarEventList()}
          renderItem={({item}) => 
          <View>  
            <Text style={styles.item}>{item.title}</Text><Text style={styles.item}>{moment( item.startDate).format("HH:mm")}-{moment( item.endtDate).format("HH:mm")}</Text>
          </View>
          }
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          keyExtractor={(item, index) => index}
          ItemSeparatorComponent={this.ItemSeparator}
        //  onEndReached={this.onEndReached()}   
          
        />


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  sectionHeader: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'tomato',
    textAlign:"right"
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    textAlign:"right"
  },
})

export default EventListScreen;