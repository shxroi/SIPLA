--
-- PostgreSQL database dump
--

-- Dumped from database version 17.3
-- Dumped by pg_dump version 17.3

-- Started on 2025-05-02 15:35:56

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 24852)
-- Name: admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    no_hp character varying(15),
    email character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admin OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24851)
-- Name: admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_id_seq OWNER TO postgres;

--
-- TOC entry 4876 (class 0 OID 0)
-- Dependencies: 217
-- Name: admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;


--
-- TOC entry 222 (class 1259 OID 24947)
-- Name: lapangan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lapangan (
    id integer NOT NULL,
    nama character varying(100) NOT NULL,
    foto_lapangan character varying(255),
    tipe character varying(50) NOT NULL,
    status character varying(50) DEFAULT 'tersedia'::character varying NOT NULL
);


ALTER TABLE public.lapangan OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24946)
-- Name: lapangan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lapangan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lapangan_id_seq OWNER TO postgres;

--
-- TOC entry 4877 (class 0 OID 0)
-- Dependencies: 221
-- Name: lapangan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lapangan_id_seq OWNED BY public.lapangan.id;


--
-- TOC entry 224 (class 1259 OID 24955)
-- Name: waktu_sewa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.waktu_sewa (
    id integer NOT NULL,
    lapangan_id integer,
    jam_mulai time without time zone NOT NULL,
    jam_selesai time without time zone NOT NULL,
    harga integer NOT NULL
);


ALTER TABLE public.waktu_sewa OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24954)
-- Name: waktu_sewa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.waktu_sewa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.waktu_sewa_id_seq OWNER TO postgres;

--
-- TOC entry 4878 (class 0 OID 0)
-- Dependencies: 223
-- Name: waktu_sewa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.waktu_sewa_id_seq OWNED BY public.waktu_sewa.id;


--
-- TOC entry 4706 (class 2604 OID 24855)
-- Name: admin id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);


--
-- TOC entry 4708 (class 2604 OID 24950)
-- Name: lapangan id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lapangan ALTER COLUMN id SET DEFAULT nextval('public.lapangan_id_seq'::regclass);


--
-- TOC entry 4710 (class 2604 OID 24958)
-- Name: waktu_sewa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waktu_sewa ALTER COLUMN id SET DEFAULT nextval('public.waktu_sewa_id_seq'::regclass);


--
-- TOC entry 4866 (class 0 OID 24852)
-- Dependencies: 218
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin (id, username, password, no_hp, email, created_at) FROM stdin;
1	admin	admin	085240727125	admin@sipla.com	2025-04-24 18:28:37.648656
\.


--
-- TOC entry 4868 (class 0 OID 24947)
-- Dependencies: 222
-- Data for Name: lapangan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lapangan (id, nama, foto_lapangan, tipe, status) FROM stdin;
2	Lapangan Futsal B	lapangan-1746042728921-800315053.jpg	futsal	perbaikan
3	Lapangan Bulutangkis A	lapangan-1746149065679-631392246.jpeg	badminton	penuh
1	Lapangan Futsal A	lapangan-1746041760380-30732238.jpg	futsal	tersedia
6	Lapangan Bulutangkis C	lapangan-1746169629708-569271573.png	badminton	tersedia
\.


--
-- TOC entry 4870 (class 0 OID 24955)
-- Dependencies: 224
-- Data for Name: waktu_sewa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.waktu_sewa (id, lapangan_id, jam_mulai, jam_selesai, harga) FROM stdin;
4	2	08:00:00	13:00:00	125000
5	3	08:00:00	11:00:00	200000
8	1	08:00:00	13:00:00	125000
9	1	13:00:00	17:00:00	150000
11	6	08:00:00	11:00:00	200000
\.


--
-- TOC entry 4879 (class 0 OID 0)
-- Dependencies: 217
-- Name: admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_id_seq', 1, true);


--
-- TOC entry 4880 (class 0 OID 0)
-- Dependencies: 221
-- Name: lapangan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lapangan_id_seq', 6, true);


--
-- TOC entry 4881 (class 0 OID 0)
-- Dependencies: 223
-- Name: waktu_sewa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.waktu_sewa_id_seq', 11, true);


--
-- TOC entry 4712 (class 2606 OID 24858)
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- TOC entry 4714 (class 2606 OID 24860)
-- Name: admin admin_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_username_key UNIQUE (username);


--
-- TOC entry 4716 (class 2606 OID 24953)
-- Name: lapangan lapangan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lapangan
    ADD CONSTRAINT lapangan_pkey PRIMARY KEY (id);


--
-- TOC entry 4718 (class 2606 OID 24960)
-- Name: waktu_sewa waktu_sewa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waktu_sewa
    ADD CONSTRAINT waktu_sewa_pkey PRIMARY KEY (id);


--
-- TOC entry 4719 (class 2606 OID 24961)
-- Name: waktu_sewa waktu_sewa_lapangan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waktu_sewa
    ADD CONSTRAINT waktu_sewa_lapangan_id_fkey FOREIGN KEY (lapangan_id) REFERENCES public.lapangan(id) ON DELETE CASCADE;


-- Completed on 2025-05-02 15:35:56

--
-- PostgreSQL database dump complete
--

