export interface SendMessageData {
  url: string;
  body: string;
  headers: any;
  message_id: any;
  project_code: string;
}

export interface DataPayload {
  messaging_product: string;
  contacts: any[];
  messages: any[];
}
