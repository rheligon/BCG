from Matcher.models import Configuracion

# Import smtplib for the actual sending function
import smtplib
# Import the email modules we'll need
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def enviar_mail(titulo,mensaje,destino):
    try:
        config = Configuracion.objects.all()[0]

        mailS = config.alertasservidor
        mailP = config.alertaspuerto
        mailUsr = config.alertasusuario 
        mailPass = config.alertaspass

        # Create a text/plain message
        msg = MIMEMultipart('alternative')

        msg['Subject'] = titulo
        msg['From'] = mailUsr
        msg['To'] = destino


        # Create the body of the message (a plain-text and an HTML version).
        text = "Hola!\nComo estás?\nAqui está el link de bcg:\nhttp://www.bcg.com.ve/"
        html = """\
        <html>
          <head></head>
          <body>
            <p>Hola!<br>
               Como estás?<br>
               Aqui está el <a href="http://www.bcg.com.ve/">link</a> de bcg.
            </p>
          </body>
        </html>
        """

        text=mensaje
        html="<html><head></head><body><p>"+mensaje.replace("\n","<br>")+"</p></body></html>"

        part1 = MIMEText(text, 'plain')
        part2 = MIMEText(html, 'html')

        msg.attach(part1)
        msg.attach(part2)

        # Send the message via our own SMTP server, but don't include the
        # envelope header.
        s = smtplib.SMTP(mailS,mailP)
        s.ehlo()
        s.starttls()
        s.ehlo()
        s.login(mailUsr,mailPass)
        s.sendmail(mailUsr, [destino], msg.as_string())
        s.quit()

    except:
        print("")