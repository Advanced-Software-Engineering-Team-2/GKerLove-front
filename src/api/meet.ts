import request from '@/utils/request'
import type { R } from '@/types/R'
import type { User } from '@/types/User'

function getmeetinglist(username: string, gender:string, min_age: number, max_age: number, city: string, institute:string) {
    return request.get<R<{ meetinglist: Array<User> }>>('/meeting/getlist',{
        params: {  
            fromusername: username,
            gender: gender,
            min_age: min_age,
            max_age: max_age,
            city: city,
            institute: institute
        }
    })
  }

function addlove(fromusername: string,tousername: string) {
    return request.post<R>('/meeting/addlove',null,{
        params: {  
            fromusername: fromusername,
            tousername : tousername
        }
    })
  }
  function notlove(fromusername: string,tousername: string) {
    return request.post<R>('/meeting/notlove',null,{
        params: {  
            fromusername: fromusername,
            tousername : tousername
        }
    })
  }

export default {
    getmeetinglist,
    addlove,
    notlove
}
