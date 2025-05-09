--
-- PostgreSQL database dump
--

-- Dumped from database version 17.3
-- Dumped by pg_dump version 17.3

-- Started on 2025-05-09 12:10:30

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
-- TOC entry 4931 (class 0 OID 0)
-- Dependencies: 217
-- Name: admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;


--
-- TOC entry 226 (class 1259 OID 24967)
-- Name: booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking (
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


ALTER TABLE public.booking OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 24985)
-- Name: booking_event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking_event (
    id integer NOT NULL,
    booking_id integer,
    nama_event character varying(100) NOT NULL,
    deskripsi text,
    tanggal_mulai date NOT NULL,
    tanggal_selesai date NOT NULL
);


ALTER TABLE public.booking_event OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 24984)
-- Name: booking_event_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.booking_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.booking_event_id_seq OWNER TO postgres;

--
-- TOC entry 4932 (class 0 OID 0)
-- Dependencies: 227
-- Name: booking_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.booking_event_id_seq OWNED BY public.booking_event.id;


--
-- TOC entry 230 (class 1259 OID 25014)
-- Name: booking_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking_history (
    id integer NOT NULL,
    booking_id integer,
    status_lama character varying(20),
    status_baru character varying(20),
    catatan text,
    admin_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.booking_history OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 25013)
-- Name: booking_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.booking_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.booking_history_id_seq OWNER TO postgres;

--
-- TOC entry 4933 (class 0 OID 0)
-- Dependencies: 229
-- Name: booking_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.booking_history_id_seq OWNED BY public.booking_history.id;


--
-- TOC entry 225 (class 1259 OID 24966)
-- Name: booking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.booking_id_seq OWNER TO postgres;

--
-- TOC entry 4934 (class 0 OID 0)
-- Dependencies: 225
-- Name: booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.booking_id_seq OWNED BY public.booking.id;


--
-- TOC entry 222 (class 1259 OID 24947)
-- Name: lapangan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lapangan (
    id integer NOT NULL,
    nama character varying(100) NOT NULL,
    foto_lapangan character varying(255),
    tipe character varying(50) NOT NULL,
    status character varying(50) DEFAULT 'tersedia'::character varying NOT NULL,
    jenis_lapangan character varying(20) DEFAULT 'futsal'::character varying NOT NULL,
    nomor_lapangan integer DEFAULT 1 NOT NULL
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
-- TOC entry 4935 (class 0 OID 0)
-- Dependencies: 221
-- Name: lapangan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lapangan_id_seq OWNED BY public.lapangan.id;


--
-- TOC entry 231 (class 1259 OID 25046)
-- Name: member; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.member (
    id integer NOT NULL,
    nama character varying(100) NOT NULL,
    no_telepon character varying(15) NOT NULL,
    lapangan_id integer,
    tanggal_mulai date NOT NULL,
    tanggal_berakhir date NOT NULL,
    jam_sewa time without time zone NOT NULL,
    status character varying(20) DEFAULT 'aktif'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    jenis_membership character varying(20) DEFAULT 'bulanan'::character varying,
    tanggal_perpanjangan date
);


ALTER TABLE public.member OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 24862)
-- Name: membership_bulutangkis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.membership_bulutangkis (
    id integer NOT NULL,
    id_admin integer,
    nama_pemesan character varying(100) NOT NULL,
    kontak character varying(15) NOT NULL,
    email character varying(100),
    tanggalmasuk date NOT NULL,
    status_keteranggotaan boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.membership_bulutangkis OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24861)
-- Name: membership_bulutangkis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.membership_bulutangkis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.membership_bulutangkis_id_seq OWNER TO postgres;

--
-- TOC entry 4936 (class 0 OID 0)
-- Dependencies: 219
-- Name: membership_bulutangkis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.membership_bulutangkis_id_seq OWNED BY public.membership_bulutangkis.id;


--
-- TOC entry 224 (class 1259 OID 24955)
-- Name: waktu_sewa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.waktu_sewa (
    id integer NOT NULL,
    lapangan_id integer,
    jam_mulai time without time zone NOT NULL,
    jam_selesai time without time zone NOT NULL,
    harga integer NOT NULL,
    kategori_waktu character varying(20) DEFAULT 'reguler'::character varying
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
-- TOC entry 4937 (class 0 OID 0)
-- Dependencies: 223
-- Name: waktu_sewa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.waktu_sewa_id_seq OWNED BY public.waktu_sewa.id;


--
-- TOC entry 4729 (class 2604 OID 24855)
-- Name: admin id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);


--
-- TOC entry 4740 (class 2604 OID 24970)
-- Name: booking id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking ALTER COLUMN id SET DEFAULT nextval('public.booking_id_seq'::regclass);


--
-- TOC entry 4746 (class 2604 OID 24988)
-- Name: booking_event id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_event ALTER COLUMN id SET DEFAULT nextval('public.booking_event_id_seq'::regclass);


--
-- TOC entry 4747 (class 2604 OID 25017)
-- Name: booking_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_history ALTER COLUMN id SET DEFAULT nextval('public.booking_history_id_seq'::regclass);


--
-- TOC entry 4734 (class 2604 OID 24950)
-- Name: lapangan id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lapangan ALTER COLUMN id SET DEFAULT nextval('public.lapangan_id_seq'::regclass);


--
-- TOC entry 4731 (class 2604 OID 24865)
-- Name: membership_bulutangkis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership_bulutangkis ALTER COLUMN id SET DEFAULT nextval('public.membership_bulutangkis_id_seq'::regclass);


--
-- TOC entry 4738 (class 2604 OID 24958)
-- Name: waktu_sewa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waktu_sewa ALTER COLUMN id SET DEFAULT nextval('public.waktu_sewa_id_seq'::regclass);


--
-- TOC entry 4754 (class 2606 OID 24858)
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- TOC entry 4756 (class 2606 OID 24860)
-- Name: admin admin_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_username_key UNIQUE (username);


--
-- TOC entry 4769 (class 2606 OID 24992)
-- Name: booking_event booking_event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_event
    ADD CONSTRAINT booking_event_pkey PRIMARY KEY (id);


--
-- TOC entry 4771 (class 2606 OID 25022)
-- Name: booking_history booking_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_history
    ADD CONSTRAINT booking_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4764 (class 2606 OID 24978)
-- Name: booking booking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_pkey PRIMARY KEY (id);


--
-- TOC entry 4760 (class 2606 OID 24953)
-- Name: lapangan lapangan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lapangan
    ADD CONSTRAINT lapangan_pkey PRIMARY KEY (id);


--
-- TOC entry 4773 (class 2606 OID 25053)
-- Name: member member_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (id);


--
-- TOC entry 4758 (class 2606 OID 24869)
-- Name: membership_bulutangkis membership_bulutangkis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership_bulutangkis
    ADD CONSTRAINT membership_bulutangkis_pkey PRIMARY KEY (id);


--
-- TOC entry 4762 (class 2606 OID 24960)
-- Name: waktu_sewa waktu_sewa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waktu_sewa
    ADD CONSTRAINT waktu_sewa_pkey PRIMARY KEY (id);


--
-- TOC entry 4765 (class 1259 OID 25036)
-- Name: idx_booking_lapangan; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_booking_lapangan ON public.booking USING btree (lapangan_id);


--
-- TOC entry 4766 (class 1259 OID 25034)
-- Name: idx_booking_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_booking_status ON public.booking USING btree (status_booking);


--
-- TOC entry 4767 (class 1259 OID 25033)
-- Name: idx_booking_tanggal; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_booking_tanggal ON public.booking USING btree (tanggal);


--
-- TOC entry 4777 (class 2606 OID 24993)
-- Name: booking_event booking_event_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_event
    ADD CONSTRAINT booking_event_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.booking(id) ON DELETE CASCADE;


--
-- TOC entry 4778 (class 2606 OID 25028)
-- Name: booking_history booking_history_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_history
    ADD CONSTRAINT booking_history_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admin(id);


--
-- TOC entry 4779 (class 2606 OID 25023)
-- Name: booking_history booking_history_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_history
    ADD CONSTRAINT booking_history_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.booking(id) ON DELETE CASCADE;


--
-- TOC entry 4776 (class 2606 OID 24979)
-- Name: booking booking_lapangan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_lapangan_id_fkey FOREIGN KEY (lapangan_id) REFERENCES public.lapangan(id) ON DELETE CASCADE;


--
-- TOC entry 4780 (class 2606 OID 25054)
-- Name: member member_lapangan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_lapangan_id_fkey FOREIGN KEY (lapangan_id) REFERENCES public.lapangan(id) ON DELETE CASCADE;


--
-- TOC entry 4774 (class 2606 OID 24870)
-- Name: membership_bulutangkis membership_bulutangkis_id_admin_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership_bulutangkis
    ADD CONSTRAINT membership_bulutangkis_id_admin_fkey FOREIGN KEY (id_admin) REFERENCES public.admin(id);


--
-- TOC entry 4775 (class 2606 OID 24961)
-- Name: waktu_sewa waktu_sewa_lapangan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waktu_sewa
    ADD CONSTRAINT waktu_sewa_lapangan_id_fkey FOREIGN KEY (lapangan_id) REFERENCES public.lapangan(id) ON DELETE CASCADE;


-- Completed on 2025-05-09 12:10:30

--
-- PostgreSQL database dump complete
--

