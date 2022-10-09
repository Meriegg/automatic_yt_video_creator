# Cum functioneaza programul

Cand dai run, prima data programul va alege un artist random, Ex: Florin Salam, Nicolae Guta, etc. Apoi, va alege un tip de video , Ex: Best Of, Manele De Dragoste, etc. Apoi, va alege daca videoclipul va avea categoria de `noi` sau `vechi`, Ex: Nicolage Guta Best Of Manele _Noi_.

Nu toate videoclipurile vor avea categoria de _Noi_ sau _Vechi_, acest proces este random.

Apoi programul o sa creeze un titlu: `{Tip De videoclip} {Nume artist} - Colaj Manele {Noi / Vechi}`

Exemple:
`Best Of Florin Salam - Colaj Manele`
`Manele De Dragoste Nicolae Guta - Colaj Manele Vechi`
`Best of Tzanca Uraganu - Colaj Manele Noi`

De mentionat este ca _Noi_ sau _Vechi_ nu vor aparea mereu.

Apoi programul va merge in folder-ul `videos` si v-a lua toate videoclipurile care indeplinesc parametri generati si le va combina intr-un singur videoclip.

Programul va genera si o descriere cu taguri si timestamp-uri.

# Inceperea programului

Primul pas este sa dai build la program.

Din folder-ul de baza tasteaza aceste comenzi:

`cd js`
`yarn run build`

Apoi tasteaza aceste comenzi:

`cd ../`
`yarn run start:script`

# Pentru adaugarea fisierelor video

Daca vrei sa adaugi un videoclip nou pentru a fii folosit trebuie sa urmezi urmatorii pasi:

1. Copiaza fisierul .mp4 in folderul `videos`
2. Numeste videoclipul astfel:
   `{Nume Artist Fara Spatii}_{Tipul de videoclip}_{Tipul De Vechime}_{un numar random}`

   `Nume Artist Fara Spatii = FlorinSalam, NicolaeGuta, etc.`
   `Tipul de videoclip = BestOf, ManeleDeDragoste, etc.`
   `Tipul De Vechime = noi / vechi`
   `Un Numar random = 1, 2, 3, 4, ..., n`

3. Pentru a adauga numele melodiei trebuie sa te duci in fisierul `songNames.txt` si sa adaugi videoclipul in acest format:

`{Numele Fisierului Din Videos fara .mp4}={Nume};`

FARA NICI UN SPATIU.
NU UITA SA ADAUGI `;` LA FINALUL ORICARUI RAND.

### **Atentie**

NU STERGE FISIERUL `list.txt` din folderul `videos`.
NU STERGE FISIERUL `songNames.txt` din folderul de baza.
NU STERGE FISIERUL `artists.txt` din folderul de baza.

Daca le-ai sters trebuie sa le creezi la loc cu _acelasi_ nume in _acelasi_ folder.

# Pentru adaugarea unui artist nou

Pentru adaugarea unui artist nou trebuie sa te duci in fisierul `artists.txt` si sa adaugi numele artistului cu `;` la final.

Numele artistului poate fii cu spatii sau fara, important este ca fisierele video sa aiba numele la fel ca in fisier dar fara spatii.

Ex:

In fisierul `artists.txt`:
`Nicolae Guta;`

In folderul `videos`:
`NicolaeGuta_{Tip}_...`

### **Atentie**

Majusculele trebuie pastrare mereu.

Acest Exemplu este gresit si are sansa sa produca o eroare:

In fisierul `artists.txt`:
`Nicolae Guta;`

In folderul `videos`:
`Nicolaeguta_{Tip}_...`

_Sau_

`Nicolae_guta_{Tip}_...`
