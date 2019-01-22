import { CustomFile } from './../../../model/customFile';
import { CallRecordService } from './../../../service/call.record.service';
import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  public recordLoading: Boolean;
  public showRecordModal: Boolean;
  @ViewChild('audio') public audio: ElementRef;

  constructor(private callRecordService: CallRecordService) { }

  public getCurrentAuidoRecord(id: string) {
    this.recordLoading = true;
    this.callRecordService.getUserAudioRecord(id)
      .then((res) => {
        if (this.showRecordModal) {
          let record;
          try {
            record = new File([res], 'record.mp3', { type: 'audio/mp3' })
          }
          catch (e) {
            record = new CustomFile([res], 'record.mp3', { type: 'audio/mp3' })
          }
          let reader = new FileReader();
          reader.readAsDataURL(record)
          reader.onload = (val) => {
            this.audio.nativeElement.src = val.target['result'];
            this.audio.nativeElement.play();
          }
          this.recordLoading = false;
        }
      })
      .catch((err) => {
        this.recordLoading = false;
        this.showRecordModal = false;
        console.log(err);
      })
  }

  public play(id: string, linkOnly?: Boolean) {
    this.showRecordModal = true;
    this.audio && this.audio.nativeElement.pause();
    if (linkOnly) {
      this.audio.nativeElement.src = id;
      this.audio.nativeElement.play();
      return;
    }
    this.getCurrentAuidoRecord(id);
  }
}
