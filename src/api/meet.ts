import request from '@/utils/request'
import type { R } from '@/types/R'
import type { User } from '@/types/User'

function getmeetinglist(username: string) {
    return request.get<R<{ meetinglist: Array<User> }>>('/meeting/getlist',{
        params: {  
            tousername: username
        }
    })
  }


export default {
    getmeetinglist
}
