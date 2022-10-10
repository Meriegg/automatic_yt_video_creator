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
   `{Nume Artist Fara Spatii}_{un numar random}.mp4`

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
`NicolaeGuta_1.mp4`

### **Atentie**

Majusculele trebuie pastrare mereu.

Acest Exemplu este gresit si are sansa sa produca o eroare:

In fisierul `artists.txt`:
`Nicolae Guta;`

In folderul `videos`:
`Nicolaeguta_2.mp4`

_Sau_

`Nicolae_guta_1.mp4`
