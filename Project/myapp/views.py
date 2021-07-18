import base64
import calendar
import datetime
import json
import time
import vobject
from django.shortcuts import render, HttpResponse,redirect
from .models import upload_image, profile, social_profile,gallery
import os
from django.core.mail import EmailMessage
from django.contrib.auth import login, authenticate,logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.core.files.base import ContentFile
from random import random
from getty_card import settings as s
import matplotlib.pyplot as plt
import PIL
from io import BytesIO
from datetime import timedelta,datetime
def login_func(request):
    if request.user.is_authenticated:
        if request.user.is_superuser:
            return redirect('ad_statistics')
        else:
            return redirect('index')
    else:
      if request.method=='POST':
        id=request.POST['uid']
        pas=request.POST['password']
        user = authenticate(username=id, password=pas)
        if user is not  None:
            login(request,user)
            if request.user.is_superuser:
                return redirect('ad_statistics')
            else:
                return redirect('index')
        else:
            return render(request, 'SignIn.html',{'message':'Invalid Credentials'})
      return render(request,'SignIn.html')

@login_required(login_url='/')
def logout_func(request):
    if request.user.is_authenticated:
        logout(request)
        return redirect('/')
    return redirect('/')

from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.http import HttpResponse
from django.shortcuts import render
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
UserModel = get_user_model()
def activate(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = UserModel._default_manager.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        key='Thank you for your email confirmation. Now you can login your account.'
    else:
        key='Activation link is invalid!'
    return render(request,'email_done.html',{'key':key})

def signup(request):
        if request.method == 'POST':
            id=request.POST['uid']
            email=request.POST['emailID']
            pas1=request.POST['createPassword']
            pas2=request.POST['confirmPassword']

            try:
                if(pas1==pas2):
                    user = User.objects.create_user(username=id,
                                            email=email,
                                            password=pas1)
                    user.is_active=False
                    user.save()
                    current_site = get_current_site(request)
                    mail_subject = 'Activate your account.'
                    message = render_to_string('accounts/acc_active_email.html', {
                        'user': user,
                        'domain': current_site.domain,
                        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                        'token': default_token_generator.make_token(user),
                    })

                    email = EmailMessage(
                        mail_subject, message, to=[email]
                    )

                    try:
                        pr_img = request.FILES['fileinput']
                    except:
                        pr_img = ""
                    if(pr_img != ""):
                        profile.objects.create(pid=user,img=pr_img)
                    else:
                        profile.objects.create(pid=user)
                    email.send()
                    return render(request,'email_confirm.html')
                else:
                    return render(request, 'signup.html', {'message': 'Password Mismatches'})
            except:
                return render(request, 'signup.html',{'message':'User Already Exist'})
        else:
          return render(request, 'signup.html')

@login_required(login_url='/')
def ad_statistics(request):
    users=User.objects.all().exclude(id=request.user.id)
    scans=upload_image.objects.all()
    sp = social_profile.objects.all()
    p=profile.objects.all()
    vcf=0
    qr=0
    sc=social_profile.objects.filter(current_datetime__month=datetime.today().month,current_datetime__year=datetime.today().year)
    for i in p:
        vcf=vcf+int(i.vcf_download)
        qr=qr+int(i.qr_generated)
    x=12
    now=time.localtime()
    tm=User.objects.filter(date_joined__year=now.tm_year,date_joined__month=now.tm_mon,is_superuser=0)

    m=[time.localtime(time.mktime((now.tm_year,now.tm_mon-n-1,1,0,0,0,0,0,0)))[:2] for n in range(x)]
    m=m[::-1]
    lm=m[11]
    tm = User.objects.filter(date_joined__year=now.tm_year, date_joined__month=now.tm_mon, is_superuser=0)
    lam=User.objects.filter(date_joined__year=lm[0],date_joined__month=lm[1],is_superuser=0)
    tmprof = social_profile.objects.filter(current_datetime__year=now.tm_year, current_datetime__month=now.tm_mon)
    lmprof = social_profile.objects.filter(current_datetime__year=lm[0], current_datetime__month=lm[1])
    if lam.count()!=0:
        pm=((tm.count()-lam.count())/lam.count())*100
    else:
        pm=((tm.count())*100)

    if lmprof.count() != 0:
        pp = ((tmprof.count() - lmprof.count()) / lmprof.count()) * 100
    else:
        pp = ((tmprof.count()) * 100)

    m_dates=[]
    m_counts=[]
    month={1:'Jan',2:'Feb',3:'Mar',4:'April',5:'May',6:'June',7:'July',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec' }
    ck=1
    for i in m:
        K=User.objects.filter(date_joined__year=i[0],date_joined__month=i[1],is_superuser=0).count()
        m_counts.append(K)
        if ck==1:
          m_dates.append(str(month[i[1]])+" "+str(i[0]))
          ck=0
        else:
            m_dates.append('')
            ck=1
    dic={'users':users.count(),'scans':scans.count(),'profiles':sp.count(),'dvcf':vcf,'dqr':qr,'m_dates':m_dates,'m_counts':m_counts,'tmu':tm.count(),'sc':sc.count(),'pm':pm,'pp':pp}
    return render(request,'adminDashboard.html',dic)

@login_required(login_url='/')
def ad_users(request):
  if(request.user.is_superuser):
    users=User.objects.all().exclude(id=request.user.id)
    list=[]
    for i in users:
        l=[]
        try:
          record=profile.objects.get(pid=i)
          l.append(i)
          l.append(record.img)
        except:
            l.append(i)
            l.append('')
        list.append(l)
    dic={'users':list}
    return render(request,'dashboard_user.html',dic)
  else:
    return render(request,'404.html')

def ad_scans(request):
    users=User.objects.all().exclude(id=request.user.id)
    scans=upload_image.objects.all()
    dic={'users':list,'scans':scans}
    return render(request,'dashboard_scan.html',dic)

@login_required(login_url='/')
def index(request):
    u_name=request.user.username
    try:
        profile = request.user.social_profile.name
        p=0
    except:
        p=1;
    if request.method == 'POST':
        img = request.POST['data']
        if img!="":
            format, imgstr = img.split(';base64,')
            ext = format.split('/')[-1]
            name='temp'+str(random())+'.'+ext
            data = ContentFile(base64.b64decode(imgstr), name=name)
        if(data!=""):
            photo = upload_image(img=data, pid=request.user)
            photo.save()
            obj = upload_image.objects.get(id=photo.id)
        #Your file Path
            path = "static" + "/" + str(obj.img)
        # output
            obj.cname='Asad'
            obj.des='Work hard for achievements'
            obj.email='asad.arsehd@kics.edu.pk'
            obj.contact='0300-4146023'
            obj.address='UET Lahore'
            obj.save()
            time.sleep(5)
            dic = {'Name': obj.cname,'Description':obj.des,'Email':obj.email,'Address':obj.address,'Contact':obj.contact}
            return HttpResponse(json.dumps(dic),content_type="application/json")
    trecords = upload_image.objects.filter(pid=request.user).count()
    dic = {'trecords': trecords,'profile':p}
    return render(request, 'index1.html', dic)

@login_required(login_url='/')
def history(request):
    import datetime
    if request.method=='POST':
        key=int(str(request.POST['key']))

        dates = []
        values = []
        if key==0:
            last_day_of_prev_month = datetime.date.today().replace(day=1) - datetime.timedelta(days=1)
            start_day_of_prev_month = datetime.date.today().replace(day=1) - datetime.timedelta(
                days=last_day_of_prev_month.day)
            dates = []
            values = []
            v1 = start_day_of_prev_month
            while (v1.day != last_day_of_prev_month.day and v1.month == last_day_of_prev_month.month):
                dates.append(str(v1.day))
                d = upload_image.objects.filter(date__exact=v1.date(), pid=request.user).count()
                values.append(d)
                v1 = v1 + datetime.timedelta(days=3)
        elif key==1:
            stw=datetime.datetime.now() - datetime.timedelta(days=7)
            edw=datetime.datetime.now()-datetime.timedelta(days=1)
            v1 = stw
            while(v1.day!=edw.day):
                dates.append(str(v1.day))
                d = upload_image.objects.filter(date__exact=v1.date(), pid=request.user).count()
                values.append(d)
                v1=v1+datetime.timedelta(days=1)

        else:
            cd = datetime.datetime.now()
            for i in range(12):
                dates.append(i+1)
                d = upload_image.objects.filter(date__year=cd.year-1,date__month=i+1,pid=request.user).count()
                values.append(d)
        fig, ax = plt.subplots()
        ax.plot(dates, values)
        fig.canvas.draw()
        img = PIL.Image.frombytes('RGB', fig.canvas.get_width_height(), fig.canvas.tostring_rgb())
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        buffered.seek(0)
        img_byte = buffered.getvalue()
        img_str = "data:image/png;base64," + base64.b64encode(img_byte).decode()
        u_name = request.user.username
        Scans = upload_image.objects.filter(pid=request.user).count()
        records = upload_image.objects.filter(pid=request.user)
        try:
            profile = request.user.social_profile.name
            p = 0
        except:
            p = 1;
        d = upload_image.objects.filter(pid=request.user, date__month=datetime.datetime.now().month)
        context = {'records': records.order_by('-date'), 'Scans': Scans, 'profile': p, 'month': d.count(),
                   'img': img_str}

        return render(request,'history.html',context)
    last_day_of_prev_month = datetime.date.today().replace(day=1) - datetime.timedelta(days=1)
    start_day_of_prev_month = datetime.date.today().replace(day=1) - datetime.timedelta(days=last_day_of_prev_month.day)
    dates = []
    values = []
    v1=start_day_of_prev_month
    while (v1.day != last_day_of_prev_month.day and v1.month==last_day_of_prev_month.month):
        dates.append(str(v1.day))
        d=upload_image.objects.filter(date__exact=v1,pid=request.user).count()
        values.append(d)
        v1 = v1 + datetime.timedelta(days=3)
    fig, ax = plt.subplots()
    ax.plot(dates, values)
    fig.canvas.draw()
    img = PIL.Image.frombytes('RGB', fig.canvas.get_width_height(), fig.canvas.tostring_rgb())
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    buffered.seek(0)
    img_byte = buffered.getvalue()
    img_str = "data:image/png;base64," + base64.b64encode(img_byte).decode()
    u_name = request.user.username
    Scans = upload_image.objects.filter(pid=request.user).count()
    records = upload_image.objects.filter(pid=request.user)
    try:
        profile = request.user.social_profile.name
        p = 0
    except:
        p = 1;
    d=upload_image.objects.filter(pid=request.user,date__month=datetime.datetime.now().month)

    context={'records':records.order_by('-date'),'Scans':Scans,'profile':p,'month':d.count(),'img':img_str}
    return render(request,'history.html',context)

@login_required(login_url='/')
def delete(request,id):
    records = upload_image.objects.get(id=id)
    records.delete()
    if request.user.is_superuser:
        return redirect('ad_scans')
    else:
        return redirect('history')


@login_required(login_url='/')
def profile_create(request):
    u_name=request.user.username
    if request.method == 'POST':
        try:
            ins = social_profile()
            ins.pid=request.user
            prof=request.FILES['profile-image']
            ins.prof_img=prof
            name = request.POST['profile-name']
            ins.name = name
            email = request.POST['profile-email']
            ins.email = email
            contact = request.POST['profile-contact']
            ins.contact = contact
            title=request.POST['profile-title']
            ins.title=title
            facebook = request.POST['facebook']
            linkedin = request.POST['linkedin']
            twitter = request.POST['twitter']
            instagram = request.POST['instagram']
            website = request.POST['website']
            ins.facebook_social_links=facebook
            ins.linkedin_social_links=linkedin
            ins.twitter_social_links=twitter
            ins.instagram_social_links=instagram
            ins.website_social_links=website

            try:
                cover=request.FILES['cover-image']
                ins.cover_img=cover
            except:
                cover=''
            try:
                profile_about=request.POST['profile-aboutme']
            except:
                profile_about=""
            ins.about=profile_about
            try:
                company_logo = request.FILES['company-logo-upload']
                ins.company_logo=company_logo
            except:
                company_logo = ''
            try:
               company_name = request.POST['company-name']
            except:
                company_name=""
            ins.company_name=company_name
            try:
                company_about = request.POST['profile-aboutCompany']
            except:
                company_about=""
            ins.about_company=company_about
            try:
                upload_gallery = request.FILES['upload-gallery-image']
            except:
                upload_gallery = ''
            try:
                upload_vedio = request.FILES['upload-promo-video']
                ins.video=upload_vedio
            except:
                upload_vedio = ''

            try:
             longitude=request.POST['longitude']
             latitude=request.POST['latitude']
            except:
                longitude = ""
                latitude = ""

            qr_type=str(request.POST['qrtype'])
            ins.qr_type=qr_type
            qr_color=str(request.POST['qrcolor'])
            if(qr_color==''):
                ins.qr_color = '#000000'
            else:
                ins.qr_color=qr_color
            if(qr_type=='1'):
              try:
                qr_logo = request.FILES['upload-qr-logo']
                ins.qr_logo=qr_logo
              except:
                qr_logo=''
            try:
               ins.save()
               gal = request.POST['image_data'].split('data')
               for i in range(1, len(gal)):
                   imglink = 'data' + gal[i]
                   format, imgstr = imglink.split(';base64,')
                   ext = format.split('/')[-1]
                   n='temp' + str(random()) + '.' + str(ext)
                   data = ContentFile(base64.b64decode(imgstr), name=n)
                   if (data != ""):
                       photo = gallery(image=data, pid=request.user)
                       photo.save()
            except:
                print("Exception")
            obj = 1
            tusers = 1
            trecords = upload_image.objects.filter(pid=request.user).count()
            if (request.user.is_superuser):
                tusers = User.objects.all().exclude(username=u_name).count()
                trecords = upload_image.objects.all().count()
            try:
                profile = request.user.social_profile.name
                p = 0
            except:
                p = 1;

            dic = {'ob': obj, 'tusers': tusers, 'trecords': trecords,'profile':p}
            return redirect('index')
        except:
           print('Exception')

    obj = 1
    tusers = 1
    trecords = upload_image.objects.filter(pid=request.user).count()
    if (request.user.is_superuser):
        tusers = User.objects.all().exclude(username=u_name).count()
        trecords = upload_image.objects.all().count()
    try:
        profile = request.user.social_profile.name
        p = 0
    except:
        p = 1;
    dic = {'ob': obj, 'tusers': tusers, 'trecords': trecords,'profile':p}
    return render(request, 'profile_create.html', dic)

@login_required(login_url='/')
def edit_profile(request,id):
    u_name=request.user.username
    profile=social_profile.objects.get(pid=id)
    if request.method == 'POST' and (request.user.social_profile.pid.id==id or request.user.is_superuser):
        try:
            try:
                prof=request.FILES['profile-image']
                if (os.path.isfile(profile.prof_img.path)):
                    os.remove(profile.prof_img.path)
                profile.prof_img=prof
            except:
                pass
            try:
                cov=request.FILES['cover-image']
                if (str(profile.company_logo)).find('default/cover.jpg') == -1:
                  if (os.path.isfile(profile.cover_img.path)):
                    os.remove(profile.cover_img.path)
                profile.cover_img = cov
            except:
                pass
            try:
                cov=request.FILES['upload-company-logo']
                if (str(profile.company_logo)).find('default/default.png') == -1:
                  if (os.path.isfile(profile.company_logo.path) ):
                    os.remove(profile.cover_img.path)
                profile.cover_img = cov
            except:
                pass
            try:
                vid=request.FILES['upload-promo-video']
                if (str(profile.video)) != "":
                  if (os.path.isfile(profile.video.path) ):
                    os.remove(profile.video.path)
                profile.video = vid
            except:
                pass

            try:
                qr_type = request.POST['qrtype']
                if (qr_type == "0" and request.POST['imgalready']=="1"):
                    if (os.path.isfile(profile.qr_logo.path)):
                         os.remove(profile.qr_logo.path)
                    profile.qr_logo=""
            except:
                pass
            try:
                if(str(request.POST['qrtype'])=="1"):
                   qr=request.FILES['upload-qr-logo']
                   if (str(profile.qr_logo)) != "":
                      if (os.path.isfile(profile.qr_logo.path) ):
                       os.remove(profile.qr_logo.path)
                   profile.qr_logo = qr
            except:
                pass
            profile.qr_type=str(request.POST['qrtype'])
            profile.qr_color=str(request.POST['qrcolor'])
            try:
             gal = request.POST['image_data'].split('data')
             for i in range(1, len(gal)):
                imglink = 'data' + gal[i]
                format, imgstr = imglink.split(';base64,')
                ext = format.split('/')[-1]
                n = 'temp' + str(random()) + '.' + str(ext)
                data = ContentFile(base64.b64decode(imgstr), name=n)
                if (data != ""):
                    photo = gallery(image=data, pid=request.user)
                    photo.save()
            except:
                pass
            name = request.POST['profile-name']
            profile.name = name
            email = request.POST['profile-email']
            profile.email = email
            contact = request.POST['profile-contact']
            profile.contact = contact
            title = request.POST['profile-title']
            profile.title = title
            try:
                profile_about=request.POST['profile-aboutme']
            except:
                profile_about=""
            profile.about=profile_about
            try:
               company_name = request.POST['company-name']
            except:
                company_name=""
            profile.company_name=company_name
            try:
                company_about = request.POST['profile-aboutCompany']
            except:
                company_about=""
            profile.about_company=company_about
            profile.facebook_social_links=request.POST['Facebook']
            profile.instagram_social_links=request.POST['Instagram']
            profile.linkedin_social_links=request.POST['Linked In']
            profile.twitter_social_links=request.POST['Twitter']
            profile.website_social_links=request.POST['Website']

            try:
                longitude = request.POST['longitude']
                latitude = request.POST['latitude']
            except:
                longitude = ""
                latitude = ""
            profile.save()
            obj = 1
            tusers = 1
            trecords = upload_image.objects.filter(pid=request.user).count()
            if (request.user.is_superuser):
                tusers = User.objects.all().exclude(username=u_name).count()
                trecords = upload_image.objects.all().count()
            try:
               record = social_profile.objects.get(pid=id)
               gallery_img=gallery.objects.filter(pid=id)
               p = 0
            except:
                p = 1;

            dic = {'ob': obj, 'tusers': tusers, 'trecords': trecords,'profile':p,'msg':'Successfully Data is Updated','record':record,'gallery':gallery_img}
            return render(request, 'profile_edit.html', dic)
        except:
            dic = {'ob': obj, 'tusers': tusers, 'trecords': trecords, 'profile': p,
                   'msg': 'Opps! Something Went Wrong Please Try Again','record':record,'gallery':gallery_img}
            return render(request, 'profile_edit.html', dic)

    obj = 1
    tusers = 1
    trecords = upload_image.objects.filter(pid=request.user).count()
    if (request.user.is_superuser):
        tusers = User.objects.all().exclude(username=u_name).count()
        trecords = upload_image.objects.all().count()
    try:
        profile = request.user.social_profile.name
        p = 0
    except:
        p = 1;
    record=social_profile.objects.get(pid=id)
    gallery_img = gallery.objects.filter(pid=id)
    dic = {'ob': obj, 'tusers': tusers, 'trecords': trecords,'profile':p,'record':record,'gallery':gallery_img}
    if (request.user.social_profile.pid.id==id or request.user.is_superuser):
        return render(request, 'profile_edit.html', dic)
    else:
        dic = {'ob': obj, 'tusers': tusers, 'trecords': trecords, 'profile': p}
        return render(request, 'previlages.html', dic)

@login_required(login_url='/')
def delete_profile(request,id):

    u_name = request.user.username
    c = profile.objects.get(pid=id)
    profile1 = social_profile.objects.get(pid=id)

    c.name_style = ""
    c.title_style = ""

    c.aboutme_color = ""
    c.aboutme_caption_style = ""
    c.aboutme_text_style = ""
    c.cover_color = ""
    c.company_backcolor = ""
    c.company_head_style = ""
    c.comp_detail_style = ""
    c.gallery_backcolor = ""
    c.gallery_caption_style = ""
    c.culture_backcolor = ""
    c.culture_headstyle = ""
    c.get_touch_style = ""
    c.contact_form_backcolor = ""
    c.footer_backcolor = ""
    c.email_style = ""
    c.phone_style = ""
    c.qr_style = ""
    c.vcf_style = ""
    c.share_style = ""
    c.save()
    if (request.user.social_profile.pid.id == id or request.user.is_superuser):
        records = social_profile.objects.get(pid=id)
        try:
            #profile
          if (str(records.prof_img)).find('default/default.png') == -1:
              if (os.path.isfile(records.prof_img.path)):
                  os.remove(records.prof_img.path)
            #Cover
          if (str(records.cover_img)).find('default/cover.jpg') == -1:
              if (os.path.isfile(records.cover_img.path)):
                  os.remove(records.cover_img.path)
            #Company logo
          if (str(records.company_logo)).find('default/default.png') == -1:
              if (os.path.isfile(records.company_logo.path)):
                  os.remove(records.company_logo.path)
            # vedio
          try:
            if (os.path.isfile(str(records.video.path))):
                  os.remove(records.video.path)
          except:
              pass
              # Qr logo
          if (str(records.qr_logo)) != "":
                if (os.path.isfile(records.qr_logo.path)):
                      os.remove(records.qr_logo.path)
          gallery_pics=gallery.objects.filter(pid=id)
          for i in gallery_pics:
              if (os.path.isfile(i.image.path)):
                  os.remove(i.image.path)
              i.delete()
        except:
            pass
        records.delete()
        return redirect('index')
    else:
        return render(request, '404.html')


@login_required(login_url='/')
def scan_vcf(request):
    if request.method=='POST':
        v = vobject.vCard()
        v.add('n')
        name = request.POST['na']
        # fam=name.split()
        v.n.value = vobject.vcard.Name(given=name)
        v.add('fn')
        v.fn.value = request.POST['na']
        v.add('email')
        v.email.value = request.POST['em']
        v.add('tel')
        v.tel.value = request.POST['con']
        v.tel.type_param = 'WORK'
        # v.add('url')
        # v.url.value = "http://example.org/people/%s/" % person.id
        output = v.serialize()
        filename = "%s.vcf" % (name)

        response = HttpResponse(output, content_type="text/x-vCard")
        response['Content-Disposition'] = 'attachment; filename=%s' % filename
        return response



def view_profile(request,id):
    if request.method=='POST':
        record = social_profile.objects.get(pid=id)
        gal=profile.objects.get(pid=record.pid)
        gal.vcf_download=int(gal.vcf_download)+1
        gal.save()
        v = vobject.vCard()
        v.add('n')
        name = record.name
        # fam=name.split()
        v.n.value = vobject.vcard.Name(given=name)
        v.add('fn')
        v.fn.value = record.name
        v.add('email')
        v.email.value = record.email
        v.add('tel')
        v.tel.value = record.contact
        v.tel.type_param = 'WORK'
        # v.add('url')
        # v.url.value = "http://example.org/people/%s/" % person.id
        output = v.serialize()
        filename = "%s.vcf" % (name)
        response = HttpResponse(output, content_type="text/x-vCard")
        response['Content-Disposition'] = 'attachment; filename=%s' % filename
        return response
    try:
      record = social_profile.objects.get(pid=id)
      g=gallery.objects.filter(pid=id)
      prof = profile.objects.get(pid=id)
      dic={'record':record,'gallery':g,'Check':g.count(),'prof':prof}
      return render(request,'publicProfile.html',dic)
    except:
        return render(request,'404.html')


def customize_profile(request, id):
    record = social_profile.objects.get(pid=id)
    prof = profile.objects.get(pid=id)
    g = gallery.objects.filter(pid=id)
    dic = {'record': record,'prof':prof,'gallery':g}
    return render(request, 'previewProfile1.html', dic)

def visitor_profile(request,id):
    try:
     record = social_profile.objects.get(pid=id)
     try:
       print("hello")
     except:
         pass
     dic={'record':record}
     return render(request,'visitor_profile.html',dic)
    except:
        return render(request, '404.html')

def email(request):
    if request.method=='POST':
        try:
          msg=EmailMessage(request.POST['sender-name'],request.POST['sender-message']+'\n'+request.POST['sender-name'],to=[str(s.EMAIL_HOST_USER)],reply_to=[request.POST['sender-email']])
          if request.FILES:
             uploaded_file=request.FILES['message-attachment']
             msg.attach(uploaded_file.name,uploaded_file.read(),uploaded_file.content_type)

          msg.send()
          return HttpResponse('Thank you '+ request.POST['sender-name'] +' ,We have received your email, We will contact with you soon');
        except:
          return HttpResponse('Opps! '+ request.POST['sender-name'] + ' ,Something Went Wrong Try It After Sometime');

def qr_count(request):
    if request.method=='POST':
        try:
          id=request.POST['count']
          record=social_profile.objects.get(pid=id)
          p = profile.objects.get(pid=record.pid)
          p.qr_generated=int(p.qr_generated)+1
          p.save()
          return redirect('view_profile', id=id)
        except:
          pass
    return render(request, '404.html')
def profiles(request):
    if(request.user.is_superuser):
        tusers = User.objects.all().exclude(username=request.user.username).count()
        trecords = upload_image.objects.all().count()
        records=social_profile.objects.all();
        try:
            profile = request.user.social_profile.name
            p = 0
        except:
            p = 1;
        context = {'records': records.order_by('-name'), 'tusers': tusers, 'trecords': trecords, 'profile': p}
        return render(request, 'profiles.html', context)
    else:
        return render(request, '404.html')

@login_required(login_url='/')
def statistics(request):
    if(request.user.is_superuser):
        tusers = User.objects.all().exclude(username=request.user.username).count()
        trecords = upload_image.objects.all().count()
        tprofiles=social_profile.objects.all().exclude(pid=request.user.social_profile.pid).count();
        u=User.objects.get(id=request.user.id)
        print(u.date_joined.date())
        try:
            profile = request.user.social_profile.name
            p = 0
        except:
            p = 1;
        today = datetime.datetime.utcnow().date()  # or you can do today = date.today() for today's date
        graph_data = []
        graph_label=[]
        for i in range(0, 7):
            d=today - timedelta(days=7 - i)
            graph_label.append(str(d)+" "+calendar.day_name[d.weekday()])
            obj_count=User.objects.filter(date_joined__date=d).count()
            graph_data.append(obj_count)
        context = {'tprofiles': tprofiles, 'tusers': tusers, 'trecords': trecords, 'profile': p,'graph_data':graph_data,'graph_label':graph_label}
        return render(request, 'statistics.html', context)
    else:
        return render(request, '404.html')

@login_required(login_url='/')
def delete_social_profile(request,id):
    if (request.user.is_superuser):
        records = social_profile.objects.get(pid=id)
        try:
          if (str(records.prof_img)).find('default/default.png') == -1:
             if (os.path.isfile(records.prof_img.path)):
              os.remove(records.prof_img.path)
          if (str(records.cover_img)).find('default/cover.jpg') == -1:
             if (os.path.isfile(records.cover_img.path)):
              os.remove(records.cover_img.path)
        except:
            pass
        records.delete()
        return redirect('profiles')

@login_required(login_url='/')
def delete_user(request,id):
    if (request.user.is_superuser):
        records = social_profile.objects.get(pid=id)
        try:
            records = User.objects.get(id=id).delete()
            return redirect('profiles')
        except:
            pass
        return redirect('profiles')

@login_required(login_url='/')
def delete_complete_user(request,id):
    if (request.user.is_superuser):
        try:
            records = User.objects.get(id=id).delete()
            return redirect('ad_users')
        except:
            pass
        return redirect('ad_users')

def download(request,id):
        try:
            p=social_profile.objects.get(pid=id);
            return HttpResponse('VCF File of '+p.name+' Downlaoded Sucessfully.')
        except:
            return HttpResponse('Opps! File Download Exception Occured.')

def multiple_delete(request):
    if request.method=='POST':
        data=json.loads(request.POST['post_id'])
        for i in data:
           try:
             records = upload_image.objects.get(id=i)
             records.delete()
           except:
               pass
        return HttpResponse('Deletion Completed')

@login_required(login_url='/')
def design(request):
    if request.method=='POST':
        c = profile.objects.get(pid=request.user.id)
        K=0
        if(request.POST['nature']=="text" and request.POST['Al']=="true"):
            c.name_style = request.POST['st']
            c.title_style = request.POST['st']
            c.aboutme_caption_style = request.POST['st']
            c.aboutme_text_style = request.POST['st']
            c.company_head_style = request.POST['st']
            c.comp_detail_style = request.POST['st']
            c.get_touch_style = request.POST['st']
            c.email_style = request.POST['st']
            c.phone_style = request.POST['st']
            c.culture_headstyle = request.POST['st']
            c.gallery_caption_style = request.POST['st']
            print('hello')
            K=1

        if (request.POST['nature'] == 'button' and request.POST['Al'] == 'true'):
            c.qr_style = request.POST['st']
            c.vcf_style = request.POST['st']
            c.share_style = request.POST['st']
            K=1

        if (request.POST['nature']=='back' and request.POST['Al']=='true'):
            c.aboutme_color = request.POST['st']
            c.company_backcolor = request.POST['st']
            c.gallery_backcolor = request.POST['st']
            c.culture_backcolor = request.POST['st']
            c.contact_form_backcolor = request.POST['st']
            c.footer_backcolor = request.POST['st']
            K=1
        if K!=1:
         if request.POST['post_id']=='holder-name':
          c.name_style=request.POST['st']
         if request.POST['post_id']=='designation':
          c.title_style=request.POST['st']
         if request.POST['post_id']=='aboutme-heading':
          c.aboutme_caption_style=request.POST['st']
         if request.POST['post_id']=='aboutme-content':
            c.aboutme_text_style=request.POST['st']
         if request.POST['post_id']=='company-details-heading':
            c.company_head_style=request.POST['st']
         if request.POST['post_id']=='company-details-content':
            c.comp_detail_style=request.POST['st']
         if request.POST['post_id']=='holder-email-section':
            c.email_style=request.POST['st']
         if request.POST['post_id']=='get-in-touch-heading':
            c.get_touch_style=request.POST['st']
         if request.POST['post_id']=='holder-contact-section':
            c.phone_style=request.POST['st']
         if request.POST['post_id']=='company-culture-heading':
            c.culture_headstyle=request.POST['st']
         if request.POST['post_id']=='photo-gallery':
            c.gallery_caption_style=request.POST['st']
        #BG Color Part
         if request.POST['post_id']=='aboutme-profile-section':
            c.aboutme_color=request.POST['st']
         if request.POST['post_id']=='aboutCompany-profile-section':
            c.company_backcolor=request.POST['st']
         if request.POST['post_id']=='gallery-section':
            c.gallery_backcolor=request.POST['st']
         if request.POST['post_id']=='companyCulture-profile-section':
            c.culture_backcolor=request.POST['st']
         if request.POST['post_id']=='get-in-touch-section':
            c.contact_form_backcolor=request.POST['st']
         if request.POST['post_id']=='footer-section':
            c.footer_backcolor=request.POST['st']
        #button
         if request.POST['post_id']=='generate-qr-btn':
            c.qr_style=request.POST['st']
         if request.POST['post_id']=='download-vcf-button-profile':
            c.vcf_style=request.POST['st']
         if request.POST['post_id']=='share-button':
            c.share_style=request.POST['st']
        c.save()
        return HttpResponse('OK')