import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { StorageService } from 'src/app/_services/storage.service';
import { RMSService } from 'src/app/_services/rms.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {

  defaultNavActiveId = 1;


  MessageId:any=null;
  TicketNo:any=null;

  PChat:any=null;


  constructor(private storageservice: StorageService, private rmsservice: RMSService, private authservice: AuthService, private route: ActivatedRoute,private db: AngularFireDatabase) { }

  ngOnInit(): void {

    let loginName  = this.route.snapshot.params['loginName']; 

    if(loginName != '' && loginName != undefined){
      this.getToken(loginName);
     }

   }

   getToken(id:any){

    this.authservice.loginTemp(id).subscribe({
      next: data => {
        
        this.storageservice.saveUser(data);
         this.rmsservice.getParentRMSByDealingOfficial().subscribe({
           next: data => {
           // debugger

            this.MessageId = data.item1;
            //this.TicketNo =
            //this.getround();
           
           },
           });

      },
      error: err => {
       // this.isLoading=0;
        // this.errorMessage = err.error.message;
        // this.isLoginFailed = true;
      }
    });
  }



  ngAfterViewInit(): void {

    // Show chat-content when clicking on chat-item for tablet and mobile devices
    document.querySelectorAll('.chat-list .chat-item').forEach(item => {
      item.addEventListener('click', event => {
        document.querySelector('.chat-content')!.classList.toggle('show');
      })
    });

  }

  // back to chat-list for tablet and mobile devices
  backToChatList() {
    document.querySelector('.chat-content')!.classList.toggle('show');
  }

  save() {
    // console.log('passs');
    
  }

  GetParentChatByMID(messageId:any){
   // debugger
    this.rmsservice.getParentRMSChatByMessageId(messageId).subscribe({
      next:data=>{
       // debugger
        this.PChat = data;

      },
    });

  }

}
