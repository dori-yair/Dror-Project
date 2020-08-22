import {simpleCalendarNLP} from '../components/simpleCalendarNLP'
import moment from 'moment';

//const nlp = require('./simpleCalendarNLP');



     //expect(simpleCalendarNLP.analyzeRequest(request).toBe();
 // });
 test('object assignment', () => {
    const data = {one: 1};
    data['two'] = 2;
    expect(data).toEqual({one: 1, two: 2});
  });


 test('two plus two is four', () => {
    expect(2 + 2).toBe(4);
  });

  test('Check start date literal time 17:00  ', () => {
    var request="תקבעי לי מחר תור בחמש לרופא"
    const result =  simpleCalendarNLP.analyzeRequest(request);
    expect(result.action).toBe('ADD');
    expect(moment( result.startDate).format("HH:mm")).toBe("17:00");
  });