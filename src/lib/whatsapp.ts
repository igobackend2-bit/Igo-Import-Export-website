export function sendWhatsAppMessage(data: {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  product?: string;
  quantity?: string;
  destination?: string;
  specifications?: string;
  message?: string;
  source?: string;
}) {
  const WHATSAPP_NUMBER = "917397789803";
  let text = `*New Website Inquiry*\n`;
  if (data.name) text += `\n*Name:* ${data.name}`;
  if (data.company) text += `\n*Company:* ${data.company}`;
  if (data.phone) text += `\n*Phone:* ${data.phone}`;
  if (data.email) text += `\n*Email:* ${data.email}`;
  if (data.product) text += `\n*Product:* ${data.product}`;
  if (data.quantity) text += `\n*Quantity:* ${data.quantity}`;
  if (data.destination) text += `\n*Destination Port:* ${data.destination}`;
  if (data.specifications) text += `\n*Specifications:* ${data.specifications}`;
  if (data.message) text += `\n*Message:* ${data.message}`;
  if (data.source) text += `\n*Source:* ${data.source}`;
  else text += `\n*Source:* IGO Import Export Website`;

  const encodedText = encodeURIComponent(text);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
  
  window.open(url, "_blank");
}
