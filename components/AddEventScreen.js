import React, { Component,useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button,TouchableHighlight } from 'react-native';
import * as Calendar from 'expo-calendar';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';

const TIME_FORMAT = "DD-MM-YY HH:mm"

class AddEventScreen extends Component {
  constructor(props) {
    super(props);
   
    if(this.props.route == undefined || this.props.route.params == undefined)    {

    //console.warn('route.title:' +    this.props.route.params['title'] + ' state.title:' +  this.state.title)
    this.state = {
      eventId: '',
      title:  '',
      eventEnd:  '',
      eventStart: '',
      eventDuration: 1,
      calendarId:  '',
      calendars:[],
    }; 
    }
    else{
      this.state = {
        eventId: this.props.route.params['id'],
        title:  this.props.route.params['title'],
        eventEnd:  this.props.route.params['endDate'],
        eventStart: this.props.route.params['startDate'],
        eventDuration: 1,
        calendarId:  this.props.route.params['calendarId'],
        calendars:[],

      }
    }    
  }
    
  getDefaultStateValue(paramName,defaultValue){
    this.isRouteParamEmpty(paramName) ? defaultValue : this.props.route.params[paramName]
  }

  isRouteParamEmpty(paramName){
    return this.isEmpty( this.props.route.params) ? true  : this.isEmpty( this.props.route.params[paramName])
  }
  
  isEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

  
  componentDidMount() {  
    
    
    Calendar.requestCalendarPermissionsAsync().then(status => console.log({status}) )
    Calendar.requestRemindersPermissionsAsync().then(status => console.log({status}))
    Calendar.getCalendarsAsync().then(cals => this.setState({ calendars: cals  }))
    
  
  }
  
  OnSubmit(){
    //console.warn(this.state)
    //var startDate = new  Date()
    var endDate = moment(this.state.eventStart).add(this.state.eventDuration,"hours").toDate()
    
    
    Calendar.createEventAsync(this.state.calendarId, {
      title: this.state.title,
      startDate: this.state.eventStart,
      endDate: endDate.toISOString(),
      allDay: false,
      notes: 'Added by miri'
    })
  }

  getEventStartDate(){
    if(this.state.eventStart == '' || this.state.eventStart == null){
      var date = new Date()
      this.setEventStartDate(null,date)
      return date
    }
    else{
      return  new  Date(this.state.eventStart)
    }
  }
  
  setEventStartDate (event, selectedDate) {
    this.setState({ eventStart : new Date(selectedDate).toISOString()})
  };

  getDefaultCalendarId(){
    
    if(!this.isEmpty(this.state.calendarId) && this.state.calendars.length>0)
      return this.state.calendarId
  
    if(this.state.calendars.length>0)
      return  this.state.calendars[0].id
    
    return null;//this.state.calendarId == '' ?  this.state.calendars[0].id :  this.state.calendarId
  }

  getCalendarList(){
    return  this.state.calendars.map( (calendar,index) => ( {label: calendar.title, value: calendar.id}))
  }
  render() {
    return (

      <View width='100%'>
        <DropDownPicker 
         items={this.getCalendarList()}
          placeholder="בחר לוח שנה"
          
          containerStyle={{height: 40}}
          //style={{backgroundColor: '#fafafa'}}
          itemStyle={{ justifyContent: 'flex-start' }}
         // dropDownStyle={{backgroundColor: '#fafafa'}}
          onChangeItem={item => this.setState({calendarId: item.value })}
          defaultValue={this.getDefaultCalendarId()}
      />
        <TextInput
          placeholder="שם האירוע"  
          style={styles.inputText}
          onChangeText={ (text)=> this.setState({title:text})}
          value={this.state.title}
        />
       
        
        <Text style={styles.text}>התחלת האירוע: {moment( this.state.eventStart).format(TIME_FORMAT) }</Text>
        <DateTimePicker
          style={styles.dateTimePicker}
          value={this.getEventStartDate()}
          mode="datetime"
          is24Hour={false}
          display="default"
          
          onChange={(event,selecteDate) =>this.setEventStartDate(event,selecteDate)  }
        />
        <DropDownPicker 
         items={[{label: 'חצי שעה', value: 0.5},{label: 'שעה', value: 1},{label: 'שעתיים', value: 2},{label: '3 שעות', value: 3}]}
          placeholder="משך האירוע"
          containerStyle={{height: 40}}
          itemStyle={{ textAlign:'right'}}
         
          onChangeItem={item => this.setState({eventDuration: item.value })}
      />
      { this.state.eventId==null?
        <Button
          title={'ליומן הוסף'}
          style={styles.input}
          onPress ={()=> this.OnSubmit()}
        />
        :<Button
        title={'עדכן'}
        style={styles.input}
        onPress ={()=> this.OnSubmit()}
      />

      }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  
  
  text:{
    padding: 20,
    textAlign:'right',
    //borderWidth: 1,
    borderBottomColor : 'skyblue',
    borderTopColor:'transparent',
    borderRightColor:'transparent',
    borderLeftColor:'transparent',
    
    width:'100%',
  },
  inputText: {
    padding: 20,
    textAlign:'right',
    borderWidth: 1,
    borderColor: 'skyblue',
    borderTopColor:'transparent',
    borderRightColor:'transparent',
    borderLeftColor:'transparent',
    margin: 0,
    width:'100%',
  },
  dateTimePicker:{
    padding: 10,
    textAlign:'right',
    borderWidth: 1,
    borderColor: 'skyblue',
    borderTopColor:'transparent',
    borderRightColor:'transparent',
    borderLeftColor:'transparent',
    margin: 20,
    width:270,
  }
});

export default AddEventScreen;