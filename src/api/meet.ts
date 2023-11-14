import request from '@/utils/request'
import type { R } from '@/types/R'
import type { User } from '@/types/User'

function getmeetinglist(username: string) {
    return request.get<R<{ meetinglist: Array<User> }>>('/meeting/getlist',{
        params: {  
            fromusername: username
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


export default {
    getmeetinglist,
    addlove
}
