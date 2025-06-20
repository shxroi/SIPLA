PGDMP  4                    }            sipla_db    17.3    17.3 R    g           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            h           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            i           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            j           1262    24827    sipla_db    DATABASE     n   CREATE DATABASE sipla_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';
    DROP DATABASE sipla_db;
                     postgres    false            �            1259    24852    admin    TABLE       CREATE TABLE public.admin (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    no_hp character varying(15),
    email character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.admin;
       public         heap r       postgres    false            �            1259    24851    admin_id_seq    SEQUENCE     �   CREATE SEQUENCE public.admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.admin_id_seq;
       public               postgres    false    218            k           0    0    admin_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;
          public               postgres    false    217            �            1259    24967    booking    TABLE       CREATE TABLE public.booking (
    id integer NOT NULL,
    lapangan_id integer,
    nama_pemesan character varying(100) NOT NULL,
    no_telepon character varying(15) NOT NULL,
    tanggal date NOT NULL,
    jam_mulai time without time zone NOT NULL,
    jam_selesai time without time zone NOT NULL,
    tipe_booking character varying(20) NOT NULL,
    status_pembayaran character varying(20) DEFAULT 'pending'::character varying,
    status_booking character varying(20) DEFAULT 'pending'::character varying,
    total_harga integer NOT NULL,
    catatan text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    jenis_booking_detail character varying(20) DEFAULT 'sekali_pinjam'::character varying
);
    DROP TABLE public.booking;
       public         heap r       postgres    false            �            1259    24985    booking_event    TABLE     �   CREATE TABLE public.booking_event (
    id integer NOT NULL,
    booking_id integer,
    nama_event character varying(100) NOT NULL,
    deskripsi text,
    tanggal_mulai date NOT NULL,
    tanggal_selesai date NOT NULL
);
 !   DROP TABLE public.booking_event;
       public         heap r       postgres    false            �            1259    24984    booking_event_id_seq    SEQUENCE     �   CREATE SEQUENCE public.booking_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.booking_event_id_seq;
       public               postgres    false    228            l           0    0    booking_event_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.booking_event_id_seq OWNED BY public.booking_event.id;
          public               postgres    false    227            �            1259    25014    booking_history    TABLE       CREATE TABLE public.booking_history (
    id integer NOT NULL,
    booking_id integer,
    status_lama character varying(20),
    status_baru character varying(20),
    catatan text,
    admin_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 #   DROP TABLE public.booking_history;
       public         heap r       postgres    false            �            1259    25013    booking_history_id_seq    SEQUENCE     �   CREATE SEQUENCE public.booking_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.booking_history_id_seq;
       public               postgres    false    230            m           0    0    booking_history_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.booking_history_id_seq OWNED BY public.booking_history.id;
          public               postgres    false    229            �            1259    24966    booking_id_seq    SEQUENCE     �   CREATE SEQUENCE public.booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.booking_id_seq;
       public               postgres    false    226            n           0    0    booking_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.booking_id_seq OWNED BY public.booking.id;
          public               postgres    false    225            �            1259    24947    lapangan    TABLE     �  CREATE TABLE public.lapangan (
    id integer NOT NULL,
    nama character varying(100) NOT NULL,
    foto_lapangan character varying(255),
    tipe character varying(50) NOT NULL,
    status character varying(50) DEFAULT 'tersedia'::character varying NOT NULL,
    jenis_lapangan character varying(20) DEFAULT 'futsal'::character varying NOT NULL,
    nomor_lapangan integer DEFAULT 1 NOT NULL
);
    DROP TABLE public.lapangan;
       public         heap r       postgres    false            �            1259    24946    lapangan_id_seq    SEQUENCE     �   CREATE SEQUENCE public.lapangan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.lapangan_id_seq;
       public               postgres    false    222            o           0    0    lapangan_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.lapangan_id_seq OWNED BY public.lapangan.id;
          public               postgres    false    221            �            1259    25114    member    TABLE     �  CREATE TABLE public.member (
    id integer NOT NULL,
    nama character varying(100) NOT NULL,
    no_telepon character varying(15) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    lapangan_id integer,
    tanggal_mulai date NOT NULL,
    tanggal_berakhir date NOT NULL,
    jam_sewa time without time zone NOT NULL,
    status character varying(20) DEFAULT 'aktif'::character varying NOT NULL,
    jenis_membership character varying(20) DEFAULT 'bulanan'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.member;
       public         heap r       postgres    false            �            1259    25113    member_id_seq    SEQUENCE     �   CREATE SEQUENCE public.member_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.member_id_seq;
       public               postgres    false    234            p           0    0    member_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.member_id_seq OWNED BY public.member.id;
          public               postgres    false    233            �            1259    24862    membership_bulutangkis    TABLE     s  CREATE TABLE public.membership_bulutangkis (
    id integer NOT NULL,
    id_admin integer,
    nama_pemesan character varying(100) NOT NULL,
    kontak character varying(15) NOT NULL,
    email character varying(100),
    tanggalmasuk date NOT NULL,
    status_keteranggotaan boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 *   DROP TABLE public.membership_bulutangkis;
       public         heap r       postgres    false            �            1259    24861    membership_bulutangkis_id_seq    SEQUENCE     �   CREATE SEQUENCE public.membership_bulutangkis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.membership_bulutangkis_id_seq;
       public               postgres    false    220            q           0    0    membership_bulutangkis_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.membership_bulutangkis_id_seq OWNED BY public.membership_bulutangkis.id;
          public               postgres    false    219            �            1259    25089    testimonial    TABLE     �  CREATE TABLE public.testimonial (
    id integer NOT NULL,
    nama character varying(100) NOT NULL,
    email character varying(100),
    pesan text NOT NULL,
    lapangan_id integer NOT NULL,
    rating integer DEFAULT 5,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT testimonial_rating_check CHECK (((rating >= 1) AND (rating <= 5))),
    CONSTRAINT testimonial_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[])))
);
    DROP TABLE public.testimonial;
       public         heap r       postgres    false            �            1259    25088    testimonial_id_seq    SEQUENCE     �   CREATE SEQUENCE public.testimonial_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.testimonial_id_seq;
       public               postgres    false    232            r           0    0    testimonial_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.testimonial_id_seq OWNED BY public.testimonial.id;
          public               postgres    false    231            �            1259    24955 
   waktu_sewa    TABLE        CREATE TABLE public.waktu_sewa (
    id integer NOT NULL,
    lapangan_id integer,
    jam_mulai time without time zone NOT NULL,
    jam_selesai time without time zone NOT NULL,
    harga integer NOT NULL,
    kategori_waktu character varying(20) DEFAULT 'reguler'::character varying
);
    DROP TABLE public.waktu_sewa;
       public         heap r       postgres    false            �            1259    24954    waktu_sewa_id_seq    SEQUENCE     �   CREATE SEQUENCE public.waktu_sewa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.waktu_sewa_id_seq;
       public               postgres    false    224            s           0    0    waktu_sewa_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.waktu_sewa_id_seq OWNED BY public.waktu_sewa.id;
          public               postgres    false    223                       2604    24855    admin id    DEFAULT     d   ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);
 7   ALTER TABLE public.admin ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    218    217    218            �           2604    24970 
   booking id    DEFAULT     h   ALTER TABLE ONLY public.booking ALTER COLUMN id SET DEFAULT nextval('public.booking_id_seq'::regclass);
 9   ALTER TABLE public.booking ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    225    226            �           2604    24988    booking_event id    DEFAULT     t   ALTER TABLE ONLY public.booking_event ALTER COLUMN id SET DEFAULT nextval('public.booking_event_id_seq'::regclass);
 ?   ALTER TABLE public.booking_event ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    227    228    228            �           2604    25017    booking_history id    DEFAULT     x   ALTER TABLE ONLY public.booking_history ALTER COLUMN id SET DEFAULT nextval('public.booking_history_id_seq'::regclass);
 A   ALTER TABLE public.booking_history ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    229    230    230            �           2604    24950    lapangan id    DEFAULT     j   ALTER TABLE ONLY public.lapangan ALTER COLUMN id SET DEFAULT nextval('public.lapangan_id_seq'::regclass);
 :   ALTER TABLE public.lapangan ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    222    222            �           2604    25117 	   member id    DEFAULT     f   ALTER TABLE ONLY public.member ALTER COLUMN id SET DEFAULT nextval('public.member_id_seq'::regclass);
 8   ALTER TABLE public.member ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    234    233    234            �           2604    24865    membership_bulutangkis id    DEFAULT     �   ALTER TABLE ONLY public.membership_bulutangkis ALTER COLUMN id SET DEFAULT nextval('public.membership_bulutangkis_id_seq'::regclass);
 H   ALTER TABLE public.membership_bulutangkis ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    219    220    220            �           2604    25092    testimonial id    DEFAULT     p   ALTER TABLE ONLY public.testimonial ALTER COLUMN id SET DEFAULT nextval('public.testimonial_id_seq'::regclass);
 =   ALTER TABLE public.testimonial ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    231    232    232            �           2604    24958    waktu_sewa id    DEFAULT     n   ALTER TABLE ONLY public.waktu_sewa ALTER COLUMN id SET DEFAULT nextval('public.waktu_sewa_id_seq'::regclass);
 <   ALTER TABLE public.waktu_sewa ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    223    224            T          0    24852    admin 
   TABLE DATA           Q   COPY public.admin (id, username, password, no_hp, email, created_at) FROM stdin;
    public               postgres    false    218   Sk       \          0    24967    booking 
   TABLE DATA           �   COPY public.booking (id, lapangan_id, nama_pemesan, no_telepon, tanggal, jam_mulai, jam_selesai, tipe_booking, status_pembayaran, status_booking, total_harga, catatan, created_at, updated_at, jenis_booking_detail) FROM stdin;
    public               postgres    false    226   �k       ^          0    24985    booking_event 
   TABLE DATA           n   COPY public.booking_event (id, booking_id, nama_event, deskripsi, tanggal_mulai, tanggal_selesai) FROM stdin;
    public               postgres    false    228   \p       `          0    25014    booking_history 
   TABLE DATA           r   COPY public.booking_history (id, booking_id, status_lama, status_baru, catatan, admin_id, created_at) FROM stdin;
    public               postgres    false    230   q       X          0    24947    lapangan 
   TABLE DATA           i   COPY public.lapangan (id, nama, foto_lapangan, tipe, status, jenis_lapangan, nomor_lapangan) FROM stdin;
    public               postgres    false    222   �r       d          0    25114    member 
   TABLE DATA           �   COPY public.member (id, nama, no_telepon, password, email, lapangan_id, tanggal_mulai, tanggal_berakhir, jam_sewa, status, jenis_membership, created_at, updated_at) FROM stdin;
    public               postgres    false    234   �s       V          0    24862    membership_bulutangkis 
   TABLE DATA           �   COPY public.membership_bulutangkis (id, id_admin, nama_pemesan, kontak, email, tanggalmasuk, status_keteranggotaan, created_at) FROM stdin;
    public               postgres    false    220   �w       b          0    25089    testimonial 
   TABLE DATA           r   COPY public.testimonial (id, nama, email, pesan, lapangan_id, rating, status, created_at, updated_at) FROM stdin;
    public               postgres    false    232   �w       Z          0    24955 
   waktu_sewa 
   TABLE DATA           d   COPY public.waktu_sewa (id, lapangan_id, jam_mulai, jam_selesai, harga, kategori_waktu) FROM stdin;
    public               postgres    false    224   �x       t           0    0    admin_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.admin_id_seq', 1, true);
          public               postgres    false    217            u           0    0    booking_event_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.booking_event_id_seq', 5, true);
          public               postgres    false    227            v           0    0    booking_history_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.booking_history_id_seq', 31, true);
          public               postgres    false    229            w           0    0    booking_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.booking_id_seq', 40, true);
          public               postgres    false    225            x           0    0    lapangan_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.lapangan_id_seq', 13, true);
          public               postgres    false    221            y           0    0    member_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.member_id_seq', 16, true);
          public               postgres    false    233            z           0    0    membership_bulutangkis_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.membership_bulutangkis_id_seq', 1, false);
          public               postgres    false    219            {           0    0    testimonial_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.testimonial_id_seq', 5, true);
          public               postgres    false    231            |           0    0    waktu_sewa_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.waktu_sewa_id_seq', 119, true);
          public               postgres    false    223            �           2606    24858    admin admin_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.admin DROP CONSTRAINT admin_pkey;
       public                 postgres    false    218            �           2606    24860    admin admin_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.admin DROP CONSTRAINT admin_username_key;
       public                 postgres    false    218            �           2606    24992     booking_event booking_event_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.booking_event
    ADD CONSTRAINT booking_event_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.booking_event DROP CONSTRAINT booking_event_pkey;
       public                 postgres    false    228            �           2606    25022 $   booking_history booking_history_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.booking_history
    ADD CONSTRAINT booking_history_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.booking_history DROP CONSTRAINT booking_history_pkey;
       public                 postgres    false    230            �           2606    24978    booking booking_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.booking DROP CONSTRAINT booking_pkey;
       public                 postgres    false    226            �           2606    24953    lapangan lapangan_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.lapangan
    ADD CONSTRAINT lapangan_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.lapangan DROP CONSTRAINT lapangan_pkey;
       public                 postgres    false    222            �           2606    25127    member member_no_telepon_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_no_telepon_key UNIQUE (no_telepon);
 F   ALTER TABLE ONLY public.member DROP CONSTRAINT member_no_telepon_key;
       public                 postgres    false    234            �           2606    25125    member member_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.member DROP CONSTRAINT member_pkey;
       public                 postgres    false    234            �           2606    24869 2   membership_bulutangkis membership_bulutangkis_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public.membership_bulutangkis
    ADD CONSTRAINT membership_bulutangkis_pkey PRIMARY KEY (id);
 \   ALTER TABLE ONLY public.membership_bulutangkis DROP CONSTRAINT membership_bulutangkis_pkey;
       public                 postgres    false    220            �           2606    25102    testimonial testimonial_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.testimonial
    ADD CONSTRAINT testimonial_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.testimonial DROP CONSTRAINT testimonial_pkey;
       public                 postgres    false    232            �           2606    24960    waktu_sewa waktu_sewa_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.waktu_sewa
    ADD CONSTRAINT waktu_sewa_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.waktu_sewa DROP CONSTRAINT waktu_sewa_pkey;
       public                 postgres    false    224            �           1259    25036    idx_booking_lapangan    INDEX     O   CREATE INDEX idx_booking_lapangan ON public.booking USING btree (lapangan_id);
 (   DROP INDEX public.idx_booking_lapangan;
       public                 postgres    false    226            �           1259    25034    idx_booking_status    INDEX     P   CREATE INDEX idx_booking_status ON public.booking USING btree (status_booking);
 &   DROP INDEX public.idx_booking_status;
       public                 postgres    false    226            �           1259    25033    idx_booking_tanggal    INDEX     J   CREATE INDEX idx_booking_tanggal ON public.booking USING btree (tanggal);
 '   DROP INDEX public.idx_booking_tanggal;
       public                 postgres    false    226            �           1259    25109    idx_testimonial_created_at    INDEX     X   CREATE INDEX idx_testimonial_created_at ON public.testimonial USING btree (created_at);
 .   DROP INDEX public.idx_testimonial_created_at;
       public                 postgres    false    232            �           1259    25108    idx_testimonial_status    INDEX     P   CREATE INDEX idx_testimonial_status ON public.testimonial USING btree (status);
 *   DROP INDEX public.idx_testimonial_status;
       public                 postgres    false    232            �           2606    24993 +   booking_event booking_event_booking_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.booking_event
    ADD CONSTRAINT booking_event_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.booking(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.booking_event DROP CONSTRAINT booking_event_booking_id_fkey;
       public               postgres    false    228    226    4778            �           2606    25028 -   booking_history booking_history_admin_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.booking_history
    ADD CONSTRAINT booking_history_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admin(id);
 W   ALTER TABLE ONLY public.booking_history DROP CONSTRAINT booking_history_admin_id_fkey;
       public               postgres    false    4768    218    230            �           2606    25023 /   booking_history booking_history_booking_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.booking_history
    ADD CONSTRAINT booking_history_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.booking(id) ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public.booking_history DROP CONSTRAINT booking_history_booking_id_fkey;
       public               postgres    false    4778    230    226            �           2606    24979     booking booking_lapangan_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_lapangan_id_fkey FOREIGN KEY (lapangan_id) REFERENCES public.lapangan(id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.booking DROP CONSTRAINT booking_lapangan_id_fkey;
       public               postgres    false    226    222    4774            �           2606    25128    member member_lapangan_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_lapangan_id_fkey FOREIGN KEY (lapangan_id) REFERENCES public.lapangan(id);
 H   ALTER TABLE ONLY public.member DROP CONSTRAINT member_lapangan_id_fkey;
       public               postgres    false    234    4774    222            �           2606    24870 ;   membership_bulutangkis membership_bulutangkis_id_admin_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.membership_bulutangkis
    ADD CONSTRAINT membership_bulutangkis_id_admin_fkey FOREIGN KEY (id_admin) REFERENCES public.admin(id);
 e   ALTER TABLE ONLY public.membership_bulutangkis DROP CONSTRAINT membership_bulutangkis_id_admin_fkey;
       public               postgres    false    218    220    4768            �           2606    25103 (   testimonial testimonial_lapangan_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.testimonial
    ADD CONSTRAINT testimonial_lapangan_id_fkey FOREIGN KEY (lapangan_id) REFERENCES public.lapangan(id) ON DELETE CASCADE;
 R   ALTER TABLE ONLY public.testimonial DROP CONSTRAINT testimonial_lapangan_id_fkey;
       public               postgres    false    4774    232    222            �           2606    24961 &   waktu_sewa waktu_sewa_lapangan_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.waktu_sewa
    ADD CONSTRAINT waktu_sewa_lapangan_id_fkey FOREIGN KEY (lapangan_id) REFERENCES public.lapangan(id) ON DELETE CASCADE;
 P   ALTER TABLE ONLY public.waktu_sewa DROP CONSTRAINT waktu_sewa_lapangan_id_fkey;
       public               postgres    false    222    4774    224            T   I   x�3�LL��̃��F&�F�F�!��̂�D���\N##S]]#C+#+cs=33S3�=... ��      \   �  x�͘�n�6�����D����m��$zS`�Ī�X�]Y�b��ʖEђ\c7�>�I}���@S�8�7�g��&�q�$<aD1�X\��J1�>ۿ��e��
m�]��u����lv�@����>"$%��ŜqEh`b<�:VJ1%�6[��~����WT �>�r1G�L��pY������xL'�T��Fa������4�(s[���שּׁC�<�FS�8�A��K9\:�\1�C6l7�|�&���~9�F�;��n#T�Q9.�2'
�d���i0��� ,��$�ۃǉ��9S�-ZD���w���Tr"��3� d�3h�M4;$i�ɳ�imG6HR�""RP�1�\i�(Md�5Ɯɐ���.L1
&N��`�e���%X��AU��)S1%��Pj�:�e���|��]����ȉi��I���LKA��XG6�2u��F�8TU�R�E���X&�BɑB7�v���OF�hLW[�����9Es%�L�@l�k�Ά�l��m T@�O�s��*�(>�ƕ�T�Ky�'#�_$��G��0'1!1���$�k�TI�5�)��z��ZX˞L��幣�n�)�q"��{?ZG�����BZI�J�1��Ŭ��``pIho�Z�Se�h���Sp�<�;�{& 2C�	B����0����c-��Ohi}TÁ(oJ��úsܛ�z���k��,�����XJ��̙��-���Dw��Ma<d�}�>���ޡ!�֚6�����`l�L��}1_�d ���h�|�����{M�q_&���=�98����F��������� g��"�*�>1�/H��譱[�G7�G �y������kKÍ�?���D�������fm>d�5_L�SK�zZ����q�����]P?�i�ȅ��#G�֫u�`�z�d�F����>W#R�)�� 8��7UmW��O:y�{��S�>_gBS�0>4��-�M��r�τ�-�3���Iȶ���ެ;h.��8x��L[��3��R� u��}�M̦�+�~6�z$	�Zݔ�e焁��_��2V�^[%�7�70��BYf����aw'��!n\"��T�)�2z����P�.�o&�4��cS{�+��⃭m�����x�V6�;������@����.���y6��&�?⫫���s�      ^   �   x�U�K
�0@�3��,&��R
�-҂]v3�H�M�$޿�b�n�ox3x	���Ұv��^�1�,�&�q3��dr���'�ȓ4Ox!
�\f�H����7iWGO"���&���"�ϧ���ٞ��*`�G�r��t�aP�K�:3�V����]��q@�7�?M      `   �  x���]N�0��ק���?��O��PhD��*}��l*%MD)F�S����®��]������o�5ܷۧ��7}uh7�k��ކ��G�
r��>u�.f/6$��]=2H	0UHS���_��P�3`�Xx��D@WHLSb,,��SbXԜy.:3�?#����uj,*�^�%�����xF*Tf�L��9z���Tg��3`���b�Ҋ]�8g���s^�խ�'�$�$r�	x�<�ݦ=L͉+��z_d�[X��Au����Ҟ�U�NN��`�ᠺ�|C�W2�V���r
�TŃ��� /-�L%>3[�=k�����SL�2�M&Ξ�;�5��GN����������v��0O��L��4,��.K���
��:�nV�$Xs2��|y9      X     x���KN�0�u|�\�Ѽ쉗�'@l����$��B��E����F�g���CL���yc_�T�oŢ�z�R>�Xbρ���p�^ί��K��rA�w�����!���+��y͝�1M]��[Jl
��P	��^�	�ҟ:u�c�?��N�_�]ܟrӏTs�:B�u��|F��~����x��E6��K�{BF�E����$���q��bd��� ����	h��Cw�и-��� �
�|躀�P1���څ�l[QU��=)'��c� ���b      d   �  x���Io�J���+�ȶ��X5�'<�AOz��a���_�N�$��%�X ���~�{O1%�����*�ȿ��vCv�>��>��6��ʝ�ɾC �������G��>�"s�;�~/#o�т]�PD�ϯ�x��@>�f���o�m���2E&��Hp�N�&�&e� �@�r�Z�b9CB�Q9.�}V�e7_�Zd?I+��t��괯/R�wぽ*��cœnH~��|^8�W8d��$\#b�H��X����"�������~\�vc��7���U��6����(�[t��q5Lҁ[��~�x������_���PcH�H�P:�v.AHA"d/�v8:8�I�N���Z�^��lҨ�N�j���g���;n�t�Ǯ�(���=��`A`b�q�)%jB�A��!T>���PۤG�o5��G�e���1;l���I����{5����fR��Jt��ɿ��Y��]����Tr��I�&8�^�T/^o$�,�Afȟ�L�:$ȟ�V�W��a�7�r�y��S�4W���O��$p�ÜV���+ի��K5�<�g��dݲ'Z�)�_�T��~>_P�A���Yzo��1�w�zj�I{z��Χ��Nc��� �5-m��+9���g�O[�(Zl�2��I�X��A	Lf�h�^��fԆ!�����0p����AOC=1b.�M��O��(@�X�wʮ7�5�u���.}aS1�1�"�21�P������5�F���:�jS�0^�vl'p��z��9�T���&-�vu������]t�II��� W$R�ˊ�yߠ��9�Co3�<�e-������~�v�T�
<���9r���jg0L�{2{���}��bE���+�
��{O�&�"������rrNzY�9.K��N����mO��Q���(��,�Iڞ��?v���	�IqB��r����H�?����V�<7      V      x������ � �      b   �   x�u��N�0E��W�b����k6S�Ҋ�-E��qZ�G�l�d]�g�)y��x�G���0��~ȤPy%�t<|�n�|G�@*��%!$ȿU2]!�8��I�v��s"��F��i���\8ڌ9. �2jV�é1d���A&��TS��l��p�����S�l)��|[��bDJA;U�n�k��~h�H��\\�11����,!&���W{KG��dn֜��{���d ��k����q�[k-f
��j���3��      Z   �   x����
�0����a$�K3�Y�t!R�"���3J�X�B��oҚ�;��G4��X^��6��ͨ�'A�yz܀�Q�Ů��G�t��,�n+0t��m����3Gt_{+�d��ӎ��W�uV ��4�Q����%���7ۣ��~��G�H��#��X�9b����*�uW�!ٵ�9����8��4[�-��f�nHsqC�G��p&�)�F-�9�D��0/^���     