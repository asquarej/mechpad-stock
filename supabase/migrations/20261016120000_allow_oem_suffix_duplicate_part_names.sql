create or replace function public.create_part_master_part(
  p_part_name text,
  p_category text,
  p_notes text default null,
  p_vehicle_model text default null,
  p_suffix text default null
)
returns table(serial_no integer, part_name text, category text, part_code text, base_code text, vehicle_model text, part_number text, full_sku text)
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_name text := trim(coalesce(p_part_name, ''));
  v_category text := trim(coalesce(p_category, ''));
  v_code text;
  v_serial integer;
  v_prefix text;
  v_core text;
  v_sku text;
  v_suffix text := nullif(upper(trim(coalesce(p_suffix, ''))), '');
  v_words text[];
begin
  if auth.uid() is null then raise exception 'Sign in before creating a part.'; end if;
  if not exists (select 1 from public.profiles p where p.id = auth.uid() and p.active = true and p.role in ('business_head','manager')) then
    raise exception 'Only the Business Head or Manager can register a new part.';
  end if;
  if v_name = '' or v_category = '' then raise exception 'Part name and category are required.'; end if;
  if length(v_name) > 120 then raise exception 'Part name must be 120 characters or fewer.'; end if;

  -- Same-name parts are allowed when an OEM suffix explicitly identifies a variant.
  if v_suffix is null and exists (select 1 from public.part_master p where lower(trim(p.part_name)) = lower(v_name)) then
    raise exception 'A part with this name already exists. Search the catalogue or provide an OEM suffix to register a distinct variant.';
  end if;

  v_words := regexp_split_to_array(regexp_replace(trim(regexp_replace(v_name, '[()]', '', 'g')), '[[:space:]]+', ' ', 'g'), ' ');
  if array_length(v_words, 1) = 1 then
    v_code := upper(left(v_words[1] || 'XXXX', 4));
  else
    v_code := upper(rpad(left(left(v_words[1], 2) || left(v_words[2], 1) || left(v_words[array_length(v_words, 1)], 1), 4), 4, 'X'));
  end if;

  v_serial := nextval('public.part_master_serial_seq');
  if v_serial > 999 then raise exception 'The generator has reached its 999-part serial limit. Review the code format before adding more parts.'; end if;

  insert into public.part_master(serial_no, part_name, category, part_code, notes, created_by)
  values (v_serial, v_name, v_category, v_code, nullif(trim(coalesce(p_notes, '')), ''), auth.uid());

  if nullif(trim(coalesce(p_vehicle_model, '')), '') is not null then
    select vm.prefix into v_prefix from public.vehicle_master vm where vm.vehicle_model = p_vehicle_model and vm.active = true;
    if v_prefix is null then raise exception 'Select a valid active vehicle model.'; end if;
    v_core := v_prefix || v_code || lpad(v_serial::text, 3, '0');
    v_sku := v_core || case when v_suffix is null then '' else '-' || v_suffix end;
    insert into public.part_numbers(serial_no, vehicle_model, part_number, suffix, full_sku, created_by)
    values (v_serial, p_vehicle_model, v_core, v_suffix, v_sku, auth.uid());
  else
    v_core := null;
    v_sku := null;
  end if;

  return query select v_serial, v_name, v_category, v_code, v_code || lpad(v_serial::text, 3, '0'),
    nullif(trim(coalesce(p_vehicle_model, '')), ''), v_core, v_sku;
end;
$function$;