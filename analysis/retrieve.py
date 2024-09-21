import pandas as pd
import firebase_admin
from firebase_admin import firestore
from firebase_admin import credentials

def firebase_initialize(cred_file):
    cred = credentials.Certificate(cred_file)
    app = firebase_admin.initialize_app(cred)

# demographic
def format_demo(dic):
    custom_order = ['q1', 'q1-other','q2', 'q3','q3','q4','q5','q6.1','q6.2','q6.3','q7','q8']
    ordered_dic = {key: dic.get(key) for key in custom_order}
    ordered_dic = {key.replace('q','D'): ordered_dic[key] for key in ordered_dic}
    return ordered_dic

# pre-study formatting
def format_pre_study(dic):
    custom_order = ['1','2','3','4','5','6','7','8','9','10']
    new_dic = {}
    for key in custom_order:
        lst = dic.get(key)
        new_cols = {}
        for i in range(3):
            new_cols['PRE'+key+'.'+str(i+1)] = lst[i]
        new_dic.update(new_cols)
    return new_dic

# post study formatting
def format_post_study(dic, n):
    new_dic = {}
    set1 = dic['set1']
    set2 = dic['set2']
    q_lst = ['S','P','D']
    prefix = 'POST' + str(n+1) + '.'
    for i in range(3):
        key = prefix + q_lst[i]
        idx = i+6*n
        new_dic[key] = set1[idx]
        new_dic[key+'-reason'] = set1[idx+3]
    for i in range(5):
        key = prefix + str(i+1)
        new_dic[key] = set2[n*5+i]
    return new_dic

def get_key(option, key_lst):
    is_pos = -1 if key_lst[0].find('pos')==-1 else 1
    if is_pos*option==1 or is_pos*option==-2:
        return key_lst
    key_lst.reverse()
    return key_lst

# format two ai task texts and the corresponding post study questionnaires
def format_ai_task(option, texts, post):
    new_dic = {}
    keys = get_key(option, list(texts.keys()))
    for i in range(2):
        num = str(i+1)
        key = keys[i]
        new_dic['AI Task '+num] = key
        new_dic['AI Text '+num] = texts.get(key)
        new_dic |= format_post_study(post,i)
    return new_dic

def format_to_df():
    db = firestore.client()
    docs = db.collection('user-input').stream()
    lst = []
    for doc in docs:
        content = doc.to_dict()
        new_content = {}
        new_content['ID'] = doc.id
        demo_dic = format_demo(content['demographicQuestions'])
        pre_study_dic = format_pre_study(content['preStudyAnswers'])
        new_content |= demo_dic | pre_study_dic
        new_content['Baseline Text'] = content.get('baselineText')
        new_content['Baseline Duration'] = content.get('baselineDuration')
        new_content['Option'] = content.get('option')
        ai_dic = format_ai_task(content['option'],content['aiWritingText'],content['postStudyAnswers'])
        new_content |= ai_dic
        lst.append(new_content)
        if doc.id=='TEST2':
            # for now
            break
    df = pd.DataFrame(lst)
    return df
